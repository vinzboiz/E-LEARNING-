const Subject = require('../models/subject.model');

// POST
exports.create = async (req, res) => {
  try {
    const subject = await Subject.createSubject(req.body);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.findAll = async (req, res) => {
  try {
    const subjects = await Subject.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.findById = async (req, res) => {
  try {
    const subject = await Subject.getSubjectById(req.params.id);
    if (subject) res.json(subject);
    else res.status(404).json({ error: 'Subject not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT
exports.update = async (req, res) => {
  try {
    const updated = await Subject.updateSubject(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    const result = await Subject.deleteSubject(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
