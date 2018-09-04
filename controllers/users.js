module.exports.controller = (app) => {
    // get homepage
    app.get('/users', (req, res) => {
        res.render('index', { title: 'Users'  });
    })
}