import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudentTarget, setDeleteStudentTarget] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    year: '3rd Year',
    attendance: 85,
    gpa: 8.0,
    phone: '',
    address: '',
    status: 'Active',
    rollNo: ''
  });

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const list = await api.students.getAll();
    setStudents(list);
    setLoading(false);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add Student Handler
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.students.create({
        ...studentForm,
        studentId: studentForm.studentId || studentForm.rollNo || `STU${Date.now().toString().slice(-4)}`
      });
      setIsAddOpen(false);
      setStudentForm({
        name: '',
        email: '',
        department: 'Computer Science',
        year: '3rd Year',
        attendance: 85,
        gpa: 8.0,
        phone: '',
        address: '',
        status: 'Active',
        rollNo: ''
      });
      showToast('Student enrolled successfully!');
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to enroll student');
    }
  };

  // Edit Student Handler
  const handleEditStudent = async (e) => {
    e.preventDefault();
    if (!editStudent) return;
    try {
      const studentKey = editStudent._id || editStudent.id || editStudent.studentId;
      await api.students.update(studentKey, editStudent);
      setEditStudent(null);
      showToast('Student information updated!');
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update student');
    }
  };

  // Delete Student Handler
  const handleDeleteStudent = async () => {
    if (!deleteStudentTarget) return;
    try {
      const studentKey = deleteStudentTarget._id || deleteStudentTarget.id || deleteStudentTarget.studentId;
      await api.students.delete(studentKey);
      setDeleteStudentTarget(null);
      showToast('Student record removed.');
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete student');
    }
  };

  // Filtering
  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stu.rollNo && stu.rollNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = deptFilter === 'All' || stu.department.toLowerCase().includes(deptFilter.toLowerCase());
    const matchesYear = yearFilter === 'All' || stu.year.toLowerCase().includes(yearFilter.toLowerCase());

    return matchesSearch && matchesDept && matchesYear;
  });

  if (loading) return <div>Loading student roster...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--success)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Directory & Roster</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage {students.length} students across departments, evaluate academic standing & track attendance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Plus size={16} /> Enroll New Student
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, student ID, roll number or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Computer">Computer Science</option>
              <option value="Information">Information Technology</option>
              <option value="Electronics">Electronics & Comm.</option>
              <option value="Mechanical">Mechanical Eng.</option>
            </select>
          </div>

          {/* Year Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No student records matching your query criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id}>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--primary)' }}>{stu.id}</code>
                      {stu.rollNo && (
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stu.rollNo}</span>
                      )}
                    </td>
                    <td>
                      <strong>{stu.name}</strong>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {stu.email}
                    </td>
                    <td>{stu.department}</td>
                    <td>{stu.year}</td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: stu.attendance >= 75 ? 'var(--success)' : 'var(--danger)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {stu.attendance}%
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{stu.gpa}</strong>
                    </td>
                    <td>
                      <Badge variant={stu.status === 'Active' ? 'success' : 'warning'}>
                        {stu.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => setViewStudent(stu)}
                          className="btn btn-outline btn-sm"
                          title="View Details"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditStudent({ ...stu })}
                          className="btn btn-secondary btn-sm"
                          title="Edit Student"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteStudentTarget(stu)}
                          className="btn btn-outline btn-sm"
                          title="Delete Student"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW STUDENT MODAL */}
      {viewStudent && (
        <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Dossier">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                {viewStudent.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{viewStudent.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewStudent.id} • {viewStudent.rollNo || '21CS042'}</span>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>DEPARTMENT</span>
                <strong>{viewStudent.department}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>CLASS YEAR</span>
                <strong>{viewStudent.year}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>ATTENDANCE RATE</span>
                <strong style={{ color: viewStudent.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>{viewStudent.attendance}%</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>CUMULATIVE GPA</span>
                <strong>{viewStudent.gpa} / 10.0</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>EMAIL</span>
                <span>{viewStudent.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PHONE</span>
                <span>{viewStudent.phone || '+91 98765 00000'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <Modal isOpen={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student Record">
          <form onSubmit={handleEditStudent} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Student Name</label>
              <input
                type="text"
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Email</label>
                <input
                  type="email"
                  value={editStudent.email}
                  onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Department</label>
                <input
                  type="text"
                  value={editStudent.department}
                  onChange={(e) => setEditStudent({ ...editStudent, department: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-3">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Year</label>
                <input
                  type="text"
                  value={editStudent.year}
                  onChange={(e) => setEditStudent({ ...editStudent, year: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Attendance %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editStudent.attendance}
                  onChange={(e) => setEditStudent({ ...editStudent, attendance: Number(e.target.value) })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editStudent.gpa}
                  onChange={(e) => setEditStudent({ ...editStudent, gpa: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditStudent(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD STUDENT MODAL */}
      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Enroll New Student">
          <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Full Student Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="rahul.s@student.college.edu"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Roll Number</label>
                <input
                  type="text"
                  placeholder="24CS055"
                  value={studentForm.rollNo}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Department</label>
                <select
                  value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Year</label>
                <select
                  value={studentForm.year}
                  onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Initial Attendance %</label>
                <input
                  type="number"
                  value={studentForm.attendance}
                  onChange={(e) => setStudentForm({ ...studentForm, attendance: Number(e.target.value) })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Initial GPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={studentForm.gpa}
                  onChange={(e) => setStudentForm({ ...studentForm, gpa: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Enroll Student
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteStudentTarget && (
        <Modal isOpen={!!deleteStudentTarget} onClose={() => setDeleteStudentTarget(null)} title="Confirm Deletion">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to remove <strong>{deleteStudentTarget.name}</strong> ({deleteStudentTarget.id}) from the active roster?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteStudentTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteStudent}>Delete Record</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
