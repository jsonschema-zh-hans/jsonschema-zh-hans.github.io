module.exports = {
    port:8079,
    debug:false,
    static:{
        "~":["./docs"],
    },
    open:{
        enabled:false,
        app: 'chrome',
        url:"/"
    }
}