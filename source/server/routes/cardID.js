
/* * @file Handles GET, PUT, and DELETE of the /api/users/* endpoint
 * @author Kevin Wang
 */
var mongoose = require('mongoose');
var Card = require('../models/card');

module.exports = function(router) {
    var url = router.route('/card/:id');

    // /api/users/* GET Request - returns data for one task
    url.get(function(req, res) {
        Card.findOne({
            _id: req.params.id
        }, function(err, card) {
            if (err) {
                res.status(404).json({
                    message: 'Failed Card ID GET',
                    data: err
                });
            } else {
                res.status(200).json({
                    message: 'User ID GET Succesful',
                    data: card
                });
            }
        });
    });

    // /api/users/* PUT Request - updates data for one task
    url.put(function(req, res) {
        Card.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }, function(err, card) {
            if (err) {
                res.status(404).json({
                    message: 'Failed User ID PUT',
                    data: err
                });
            } else {
                res.status(200).json({
                    message: 'User ID PUT Succesful',
                    data: card,
                });
            }
        })
    });

    // /api/users/* DELETE Request - deletes one task
    url.delete(function(req, res) {
        Card.deleteOne({
            _id: req.params.id
        }, function(err, card) {
            if (err) {
                res.status(404).json({
                    message: 'Failed User ID DELETE',
                    data: err
                });
            } else {
                res.status(200).json({
                    message: 'User ID DELETE Succesful',
                    data: card,
                });
            }
        })
    });

    return router;
}
