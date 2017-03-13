define(function() {
    var XSlider = function(options) {
        var defautls = {
            dom: "#slider",
            imgs: [],
            timer: true,
            interval: 5000,
            real_widht: 0,
            real_height: 0,
            top: 0,
            onLoad: null
        }
        var options = $.extend(defautls, options);
        var obj = this;
        var box = $(options.dom);
        var box_imgs, box_imgs_ul, ctl_pre, ctl_next, box_btns, img_width = 0,
            img_height = 0,
            curr_imgs = [],
            curr_index = 0,
            timer = null;

        function coverBox(wid, hei) {
            box_imgs_ul.css("margin-top", options.top);
            var temp = {
                width: 0,
                height: 0
            };
            temp.width = img_width;
            temp.height = hei / wid * img_width >> 0;
            if (options.real_height > 0 && temp.height < options.real_height) {
                temp.height = options.real_height;
                temp.width = wid / hei * temp.height >> 0;
            }
            return temp;
        }

        function render() {
            box_imgs_ul.empty().width(img_width * curr_imgs.length);
            box_btns.empty();
            if (curr_imgs.length > 0) {
                var temp = coverBox(curr_imgs[0].width, curr_imgs[0].height);
                for (var i = 0; i < curr_imgs.length; i++) {
                    var img = "<li style=\"width:" + img_width + "px;height:" + (options.real_height == 0 ? temp.height : options.real_height) + "px\"><a href=\"javascript:;\"><img style=\"height:" + temp.height + "px;width:" + temp.width + "px\" src=\"" + curr_imgs[i].img + "\" /></a></li>";
                    box_imgs_ul.append(img);
                    box_btns.append("<a href=\"javascript:;\"></a>");
                }
                $("a", box_btns).eq(0).addClass("active");
            }
        }

        function move() {
            box_imgs_ul.css({
                "transform": "translateX(-" + (curr_index * img_width) + "px)"
            });
            $("a", box_btns).removeClass("active").eq(curr_index).addClass("active");
        }

        function pre() {
            curr_index--;
            if (curr_index < 0) curr_index = curr_imgs.length - 1;
            move();
        }

        function next() {
            curr_index++;
            if (curr_index >= curr_imgs.length) curr_index = 0;
            move();
        }

        function loop() {
            if (timer) clearInterval(timer);
            timer = setInterval(next, options.interval);
            box.off().on("mouseover", function() {
                if (timer) clearInterval(timer);
            }).on("mouseleave", function() {
                loop();
            });
        }

        function init() {
            box.addClass("xslider");
            box_imgs = $(".xslider-imgs", box);
            box_imgs_ul = $(".xslider-imgs ul", box);
            ctl_pre = $(".pre", box);
            ctl_next = $(".next", box);
            box_btns = $(".xslider-btns", box);
            ctl_pre.click(pre);
            ctl_next.click(next);
            obj.update();
            if (options.timer) loop();
            $(box_btns).on("click", "a", function() {
                curr_index = $(this).index();
                move();
            });
            load();
        }

        function load() {
            for (var i = 0; i < options.imgs.length; i++) {
                var item = options.imgs[i];
                var tmp_img = new Image();
                tmp_img.index = i;
                tmp_img.onload = function() {
                    var tmp = {
                        url: options.imgs[this.index].url,
                        img: options.imgs[this.index].img,
                        width: this.width,
                        height: this.height
                    }
                    curr_imgs[curr_imgs.length] = tmp;
                    obj.update();
                }
                tmp_img.src = item.img;
            }
        }
        this.update = function() {
            img_width = box.width();
            render();
            options.onLoad && options.onLoad();
        }
        $(window).resize(function() {
            obj.update();
            move();
        });
        var html = "<div class=\"xslider-imgs\"><ul></ul></div>" +
            "<a href=\"javascript:;\" class=\"pre\">&lt;</a><a href=\"javascript:;\" class=\"next\">&gt;</a>" +
            "<div class=\"xslider-btns\"></div>";
        box.html(html);
        init();
    }
    return XSlider;
});