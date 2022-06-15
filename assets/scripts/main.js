const $ = require("jquery");

import Router from "./utils/Router";
import home from "./home";
import common from "./common";

const routes = new Router({
    home,
    common,
});

jQuery(document).on("ready", function () {
    routes.loadEvents();
});
