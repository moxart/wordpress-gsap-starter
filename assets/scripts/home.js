import $ from "jquery";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    init() {
        gsap.registerPlugin(ScrollTrigger);
    },
    finalize() {

    },
};
