var express = require('express');
var notice = express.Router();
const { getNotices,
    getNoticeByID,
    insertNotice,
    updateNotice,
    deleteNotice, getAllNotice } = require('../controllers/noticeController')

/* GET notices listing. */
notice.get('/', (req, res) => {
    if (req.query.noticeID) {
        getNoticeByID(req, res)
    } else {
        getNotices(req, res)
    }
});

notice.get('/all',getAllNotice)

notice.post('/', insertNotice);
notice.put('/:noticeID', updateNotice);
notice.delete('/:noticeID', deleteNotice);


module.exports = notice;
