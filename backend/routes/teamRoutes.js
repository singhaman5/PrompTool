const express = require('express');
const router = express.Router();
const { createTeam, getTeams, inviteMember } = require('../controllers/teamController');
const { verifyToken } = require('../middleware/authMiddleware');

// The Routes!
// They are protected by our verifyToken Security Guard
router.post('/', verifyToken, createTeam); // POST /api/teams -> make new team
router.get('/', verifyToken, getTeams);    // GET /api/teams -> fetch my teams
router.post('/invite', verifyToken, inviteMember); // POST /api/teams/invite -> add member

module.exports = router;
