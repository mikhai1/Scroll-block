/*
	Mikhail Sergeevich
	18.01.2016
*/

(function($) {

	$.fn.scroll_block = (function() {
		if(this.data("scroll_block") == true || this.html() == undefined) {
			return this;
		}
		this.data("scroll_block", true);

		var wnd = $(window),
			parent = this,
			block = parent.wrapInner("<div id=\"scroll_block_jquery\" style=\"position:relative;display:block;width:100%;top:0;left:0;max-width:" + (parent.width()) + "px\"></div>").children("#scroll_block_jquery"),
			scroll_prev = wnd.scrollTop(),
			scroll,
			block_top,
			dy,
			max_top_wnd,
			max_top,
			left,
			to_down = {},
			to_top = {},
			set = {
				t: (function() {
					block.css({"position": "relative", "top": 0, "left": 0});
				}),
				b: (function() {
					block.css({"position": "relative", "top": (max_top + "px"), "left": 0});
				})},
			def = (function() {
				max_top_wnd = (block.height() - wnd.height());
				max_top = (parent.height() - block.height());
				left = parent.offset().left;

				to_top.top = parent.offset().top;
				to_top.bottom = (parent.offset().top + max_top);
				if(max_top_wnd > 0) {
					to_down.top = (parent.offset().top + block.height() - wnd.height());
					to_down.bottom = (parent.offset().top + parent.height() - wnd.height());
				}
				else {
					to_down.top = parent.offset().top;
					to_down.bottom = (parent.offset().top + parent.height() - block.height());
				}

				set.f = (function() {
					var top_temp;
					if(max_top_wnd > 0) {
						top_temp = block.offset().top - wnd.scrollTop();
						if(top_temp < -max_top_wnd) {
							top_temp = -max_top_wnd;
						}
						else if(top_temp > 0) {
							top_temp = 0;
						}
					}
					else {
						top_temp = 0;
					}
					block.css({"position": "fixed", "top": (top_temp + "px"), "left": left});
				});
			});

		def();

		$(document).on("scroll_edit", function() {
			def();
			var d = wnd.scrollTop() + wnd.height() - block.offset().top - block.height();
			if(max_top_wnd > 0 && block.css("position") == "relative" && d > 0) {
				var top_temp = parseInt(block.css("top"));
				block.css("top", (top_temp + d));
				set.f();
			}
		});

		wnd.resize(function() {
			def();
		});

		wnd.scroll(function() {
			scroll = wnd.scrollTop();
			block_top = parseInt(block.css("top"));
			dy = (scroll - scroll_prev);
			
			if(dy > 0) {
				if(scroll <= to_down.top) {
					set.t();
				}
				else if(scroll >= to_down.bottom) {
					set.b();
				}
				else {
					if(block.css("position") == "relative") {
						set.f();
					}
					else if(max_top_wnd > 0 && block_top > -max_top_wnd) {
						block.css("top", ((block_top - dy) > -max_top_wnd)?(block_top - dy):-max_top_wnd);
					}
				}
			}
			else if(dy < 0) {
				if(scroll <= to_top.top) {
					set.t();
				}
				else if(scroll >= to_top.bottom) {
					set.b();
				}
				else {
					if(block.css("position") == "relative") {
						set.f();
					}
					else if(max_top_wnd > 0 && block_top < 0) {
						block.css("top", ((block_top - dy) < 0)?(block_top - dy):0);
					}
				}
			}

			scroll_prev = wnd.scrollTop();
		});

		return this;
	});

})(jQuery);
