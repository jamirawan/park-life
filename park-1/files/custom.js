// JavaScript Document

(function ($) {

function post(path, params, method='post') {
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

$(document).ready(function() {

if ($('#splash-page').length) {

	function resize_bg() {
		var mobile_bg = $('#splash-page').data('mobile-background');
		var normal_bg = $('#splash-page').data('background');

		if (!mobile_bg) {
			mobile_bg = normal_bg;
		}

		if ($('#splash-page').length && $(window).width() < 470) {
    		$('#splash-page').css('background-image', 'url('+mobile_bg+')');
	    } else if ($('#splash-page').length && $(window).height() < 650) {
	    	$('#splash-page').css('background-image', 'url('+normal_bg+')');
	    } else {
	    	$('#splash-page').css('background-image', 'url('+normal_bg+')');
	    }
	}

	resize_bg();

	$(window).resize(function() {
		waitForFinalEvent(function(){
	      resize_bg();
	    }, 500, "wait for resize");
	});
}

if ($('#survey').length) {

	var $form = $('#survey');

	$('#laptop-fb-connect-btn,#mobile-fb-connect-btn').click(function(event) {
		$form = $('#user-registration');
		var session_id = $('[name="session_id"]').val();

		$form.unbind('submit');

		$form.submit(function(event) {
			event.preventDefault();

			$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').attr('disabled', 'disabled');
			$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html('Loading..');

			$.ajax({
			  type: "POST",
			  url: $form.attr('action'),
			  data: $form.serialize(),
			  success: function(data) {
				var gatewaytype = $('[name="gatewaytype"]').val();
			  	if (gatewaytype == 'mkt') {
					// Construct the 2nd redirect URL with the given parameters and set the value to destinationURL
					var destinationURL = $form.data('redirection_url');
					var clientmac = $('[name="usermac"]').val().toLowerCase();
					var sip = $('[name="sip"]').val();
					//don't change following two lines
					var loginUrl = "http://" + sip + "/login?username=" + clientmac + "&password=" + clientmac + "&dst=" + destinationURL;
					setTimeout(function () {
						window.location.href = '/redirect?redirect=' + encodeURIComponent(loginUrl) + '&session_id=' + session_id;
					}, 2000);
				} else if (gatewaytype == 'cambium') {
					var redirection_url = $form.data('redirection_url');
					var csrf_token = $('[name="_token"]').val();
					var client_mac = $('[name="client_mac"]').val();
					var queryDict = {};
					location.search.substr(1)
						.split("&")
						.forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

					queryDict['ga_orig_url'] = window.location.origin + '/redirect?redirect=' + encodeURIComponent(redirection_url) + '&session_id=' + session_id;

					var queryParams = '';
					for (var key in queryDict) {
						queryParams += key + '=' + queryDict[key] + '&';
					}

					post("/splash/proxy" + "?" + queryParams,
						{
							_token: csrf_token,
							username: client_mac,
							password: client_mac
						});
				} else if (gatewaytype == 'meraki') {
					var destinationURL = $form.data('redirection_url');
					var sip = $('[name="sip"]').val();
					var loginUrl = sip + "?continue_url=" + destinationURL;
					if (is_social) {
						loginUrl = '/redirect?redirect=' + encodeURIComponent(loginUrl) + '&session_id=' + session_id;
					}
					setTimeout(function() {
						window.location.href = '/redirect?redirect=' + encodeURIComponent(loginUrl) + '&session_id=' + session_id;
					}, 2000);
			  	} else {
			  		var redirection_url = $form.data('redirection_url');
			  		var sip = $('[name="sip"]').val();
                    var uip = $('[name="uip"]').val();
                    var client_mac = $('[name="client_mac"]').val();
					var proxy = $('[name="proxy"]').val();

					setTimeout(function() {
						post("https://" + sip + ":9998/SubscriberPortal/hotspotlogin", {
							username: client_mac,
							password: client_mac,
							client_mac: client_mac,
							uip: uip,
							url: window.location.origin + '/redirect?redirect=' + encodeURIComponent(redirection_url) + '&session_id=' + session_id,
							proxy: proxy,
						});
					}, 2000);
			  	}
			  },
			  error: function(xhr, status, error) {
				  $('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html($.parseJSON(xhr.responseText).message);
			  },
			  dataType: 'json'
			});
		});

		$form.trigger('submit');
	})

	$('#laptop-connect-btn,#mobile-connect-btn').click(function(event) {
		event.preventDefault();

		$form.unbind('submit');

		$form.submit(function(event) {
			event.preventDefault();

			var ref = $(this).find("[required]");
			var valid = true;
		    $(ref).each(function() {
		        if ($.trim($(this).val()) == '') {
		            $(this).focus();
		            $(this).css('border-color', 'red');
		            valid = false;
		            return false;
		        }
		    });

		    if (!valid) {
		    	return false;
		    }

		    $('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').attr('disabled', 'disabled');
			$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html('Loading..');

			$.ajax({
			  type: "POST",
			  url: $form.attr('action'),
			  data: $form.serialize(),
			  success: function(data) {
			  	if (data == 200) {
			  		$('#laptop-connect-btn,#mobile-connect-btn').html('Redirecting..');
			  	}

			  	$form = $('#user-registration');
			  	$.ajax({
				  type: "POST",
				  url: $form.attr('action'),
				  data: $form.serialize(),
				  success: function(data) {
				  	if (data == 200) {
				  		$('#laptop-connect-btn,#mobile-connect-btn').html('Redirecting..');
				  	}

				  	var gatewaytype = $('[name="gatewaytype"]').val();
				  	if (gatewaytype == 'mkt') {
				  		// Construct the 2nd redirect URL with the given parameters and set the value to destinationURL
				        var destinationURL = $form.data('redirection_url');
				        var clientmac = $('[name="usermac"]').val().toLowerCase();
				        var sip = $('[name="sip"]').val();
				        //don't change following two lines
				        var loginUrl = "http://" + sip + "/login?username=" + clientmac + "&password=" + clientmac + "&dst=" + destinationURL;
				        setTimeout(function() {
				          window.location.href = loginUrl;
						}, 2000);
					} else if (gatewaytype == 'cambium') {
						var redirection_url = $form.data('redirection_url');
						var csrf_token = $('[name="_token"]').val();
						var client_mac = $('[name="client_mac"]').val();
						var queryDict = {};
						location.search.substr(1)
							.split("&")
							.forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

						queryDict['ga_orig_url'] = redirection_url;

						var queryParams = '';
						for (var key in queryDict) {
							queryParams += key + '=' + queryDict[key] + '&';
						}

						post("/splash/proxy" + "?" + queryParams,
							{
								_token: csrf_token,
								username: client_mac,
								password: client_mac
							});
					} else if (gatewaytype == 'meraki') {
						var destinationURL = $form.data('redirection_url');
						var sip = $('[name="sip"]').val();
						var loginUrl = sip + "?continue_url=" + destinationURL;
						setTimeout(function() {
							window.location.href = loginUrl;
						}, 2000);
				  	} else {
				  		var redirection_url = $form.data('redirection_url');
				  		var sip = $('[name="sip"]').val();
		                var uip = $('[name="uip"]').val();
		                var client_mac = $('[name="client_mac"]').val();
						var proxy = $('[name="proxy"]').val();

						setTimeout(function () {
							post("https://" + sip + ":9998/SubscriberPortal/hotspotlogin",
								{
									username: client_mac,
									password: client_mac,
									client_mac: client_mac,
									uip: uip,
									url: redirection_url,
									proxy: proxy,
								});
						}, 2000);
		            }
				  },
				  error: function(xhr, status, error) {
					  $('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html($.parseJSON(xhr.responseText).message);
				  },
				  dataType: 'json'
				});
			  },
			  error: function(event) {
			  	console.log('something went wrong');
			  },
			  dataType: 'json'
			});

			return true;
		});

		$form.trigger('submit');
	});

} else if ($('form').length > 0) {
	var $form = $('form');
	var session_id = $('[name="session_id"]').val();
	$form.submit(function(event) {
		event.preventDefault();

		$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').attr('disabled', 'disabled');
		$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html('<i class="fa fa-spin fa-circle-o-notch"></i>LOADING..');

		$.ajax({
		  type: "POST",
		  url: $form.attr('action'),
		  data: $form.serialize(),
		  success: function(data) {
			setTimeout(function() {
				var is_social = false;
				if ($('#laptop-fb-connect-btn').length || $('#mobile-fb-connect-btn').length) {
					is_social = true;
				}

				var gatewaytype = $('[name="gatewaytype"]').val();
			  	if (gatewaytype == 'mkt') {
			  		// Construct the 2nd redirect URL with the given parameters and set the value to destinationURL
			        var destinationURL = $form.data('redirection_url');
			        var clientmac = $('[name="usermac"]').val().toLowerCase();
			        var sip = $('[name="sip"]').val();
			        //don't change following two lines
			        var loginUrl = "http://" + sip + "/login?username=" + clientmac + "&password=" + clientmac + "&dst=" + destinationURL;
			        if (is_social) {
			        	loginUrl = '/redirect?redirect=' + encodeURIComponent(loginUrl) + '&session_id=' + session_id;
			        }
			        setTimeout(function() {
				      window.location.href = loginUrl;
					}, 2000);
				} else if (gatewaytype == 'cambium') {
					var redirection_url = $form.data('redirection_url');
					var csrf_token = $('[name="_token"]').val();
					var client_mac = $('[name="client_mac"]').val();
					var queryDict = {};
					location.search.substr(1)
						.split("&")
						.forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

					if (is_social) {
						redirection_url = window.location.origin + '/redirect?redirect=' + encodeURIComponent(redirection_url) + '&session_id=' + session_id;
					}

					queryDict['ga_orig_url'] = redirection_url;

					var queryParams = '';
					for (var key in queryDict) {
						queryParams += key + '=' + queryDict[key] + '&';
					}

					post("/splash/proxy" + "?" + queryParams,
						{
							_token: csrf_token,
							username: client_mac,
							password: client_mac
						});
				} else if (gatewaytype == 'meraki') {
					var destinationURL = $form.data('redirection_url');
					var sip = $('[name="sip"]').val();
					var loginUrl = sip + "?continue_url=" + destinationURL;
					if (is_social) {
						loginUrl = '/redirect?redirect=' + encodeURIComponent(loginUrl) + '&session_id=' + session_id;
					}
					setTimeout(function() {
						window.location.href = loginUrl;
					}, 2000);
			  	} else {
			  		var redirection_url = $form.data('redirection_url');
			  		var sip = $('[name="sip"]').val();
			  		var uip = $('[name="uip"]').val();
	                var client_mac = $('[name="client_mac"]').val();
					var proxy = $('[name="proxy"]').val();

			  		if (is_social) {
			  			redirection_url = window.location.origin + '/redirect?redirect=' + encodeURIComponent(redirection_url) + '&session_id=' + session_id;
			  		}

					setTimeout(function () {
						post("https://" + sip + ":9998/SubscriberPortal/hotspotlogin",
							{
								username: client_mac,
								password: client_mac,
								client_mac: client_mac,
								uip: uip,
								url: redirection_url,
								proxy: proxy,
							});
					}, 2000);
			  	}
			}, 2000);
		  },
		  error: function(xhr, status, error) {
			$('#laptop-connect-btn,#mobile-connect-btn,#laptop-fb-connect-btn,#mobile-fb-connect-btn').html($.parseJSON(xhr.responseText).message);
		  },
		  dataType: 'json'
		});
	});
}

$('#redirect_button').click(function(event) {
	event.preventDefault();

	$('#redirect_button').html('<i class="fa fa-spin fa-circle-o-notch"></i>LOADING..');

	location.href = $('#redirect_button').data('redirection_url');
});
});

$(document).ready(function() {

	function resize_overlay() {
		if ($('.slider-style-1').length && $(window).height() < 470) {
	    	$('.slider-style-1').css('margin-top', '-170px');
	    	$('.slider-style-1').css('top', '50%');
	    	$('#wifi-img').css('width', '140px');
	    	$('.get-access').css('padding-top', '15px');
	    } else if ($('.slider-style-1').length && $(window).height() < 650) {
	    	$('.slider-style-1').css('margin-top', '-210px');
	    	$('.slider-style-1').css('top', '50%');
	    	$('#wifi-img').css('width', '200px');
	    	$('.get-access').css('padding-top', '15px');
	    } else {
	    	var width = $(window).width() * 0.8;
	    	if (width > 350) {
	    		width = 350;
	    	}
	    	$('.slider-style-1').css('margin-top', '-270px');
	    	$('.slider-style-1').css('top', '50%');
	    	$('#wifi-img').css('width', width+'px');
	    	$('.get-access').css('padding-top', '15px');
	    }
	}

	resize_overlay();

	waitForFinalEvent(function(){
      resize_overlay();
    }, 500, "wait for resize");

	$(window).on('orientationchange',function(){
		waitForFinalEvent(function(){
	      resize_overlay();
	    }, 500, "orientation change");
	});

	$(window).resize(function() {
		waitForFinalEvent(function(){
	      resize_overlay();
	    }, 500, "wait for resize");
	});

    //Go down to terms and conditions
	$('.get-access').click(function() {
		$('body, html').animate({
			scrollTop: $('#terms-and-conditions').offset().top
		}, 800, 'easeInOutQuad');
		return false;
	});

	function validateEmail(email) {
	    var re = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/i;
	    return re.test(email);
	}

	$('#mc-embedded-subscribe-form').submit(function(event) {
		event.preventDefault();

		if (validateEmail($('#mce-EMAIL').val())) {
			$('.menu-top').toggleClass('show-menus');
        	$('.menu-wrapper-background').fadeOut(250);
			$('#mce-EMAIL').css('border-color', '#999');
			$.ajax({
				type: 'POST',
				url: $('#mc-embedded-subscribe-form').attr('action'),
				data: $('#mc-embedded-subscribe-form').serialize()
			});
		} else {
			$('#mce-EMAIL').css('border-color', 'red');
			$('#mce-EMAIL').focus();
		}

	});

    //Top Menu
    $('.show-navigation').click(function(){
        $('.menu-top').toggleClass('show-menus');
        $('.menu-wrapper-background').fadeIn(250);
        return false;
    });

    $('.close-menu, .menu-wrapper-background').click(function(){
        $('.menu-top').toggleClass('show-menus');
        $('.menu-wrapper-background').fadeOut(250);
        return false;
    });

    $('.has-submenu').click(function(){
       //$(this).parent().find('.submenu').slideToggle(350);
       $(this).parent().find('.submenu').toggleClass('show-submenu');
       $(this).find('.fa-plus').toggleClass('active-plus');
       return false;
    });

	/*/////////*/
	/*Pie Chart*/
	/*/////////*/

	var pieData = [
		{	value: 50,	color: "#e74c3c", highlight: "#c0392b", label: "Red"			},
		{	value: 10,	color: "#2ecc71", highlight: "#27ae60",	label: "Green"			},
		{	value: 20,	color: "#f1c40f", highlight: "#f39c12",	label: "Yellow"			},
		{	value: 20,	color: "#2c3e50", highlight: "#34495e",	label: "Dark Blue"		}
	];

	var barChartData = {
		labels : ["One","Two","Three","Four","Five"],
		datasets : [
			{
				fillColor : "rgba(0,0,0,0.1)",
				strokeColor : "rgba(0,0,0,0.2)",
				highlightFill: "rgba(0,0,0,0.25)",
				highlightStroke: "rgba(0,0,0,0.25)",
				data : [20,10,40,30,10]
			}
		]

	}

	// window.onload = function(){
	// 	var pie_chart_1 = document.getElementById("generate-pie-chart").getContext("2d");
	// 	window.pie_chart_1 = new Chart(pie_chart_1).Pie(pieData);

	// 	var bar_chart_1 = document.getElementById("generate-bar-chart").getContext("2d");
	// 	window.pie_chart_1 = new Chart(bar_chart_1).Bar(barChartData);

	// };

    //Share Bottom Socials

    $('.show-share-bottom').click(function(){
       $('.share-bottom').toggleClass('active-share-bottom');
        return false;
    });

    $('.close-share-bottom, .open-menu, .open-more').click(function(){
       $('.share-bottom').removeClass('active-share-bottom');
        return false;
    });

	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

    //Countdown timer

	var endDate = "June 7, 2015 15:03:25";

	$('.countdown').countdown({
	  date: endDate,
	  render: function(data) {
		$(this.el).html(
		"<div class='countdown-box box-years'><div class='countdown-years'>" + this.leadingZeros(data.years, 2) +
		"</div><span>years</span></div><div class='countdown-box box-days'><div class='countdown-days'>" + this.leadingZeros(data.days, 2) +
		"</div><span>days</span></div><div class='countdown-box box-hours'><div class='countdown-hours'>" + this.leadingZeros(data.hours, 2) +
		"</div><span>hours</span></div><div class='countdown-box box-minutes'><div class='countdown-minutes'>" + this.leadingZeros(data.min, 2) +
		"</div><span>min</span></div><div class='countdown-box box-seconds'><div class='countdown-seconds'>" + this.leadingZeros(data.sec, 2) +
		"</div><span>sec</span></div>");
	  }
	});


	//Animate.css scroll to begin animation //

	var wow = new WOW(
	  {
		boxClass:     'animate',      // animated element css class (default is wow)
		animateClass: 'animated',     // animation css class (default is animated)
		offset:       0,              // distance to the element when triggering the animation (default is 0)
		mobile:       true,           // trigger animations on mobile devices (true is default)
	  }
	);
	wow.init();

	//Go up

	$('.footer-up').click(function() {
		$('body, html').animate({
			scrollTop:0
		}, 800, 'easeInOutQuad');
		return false;
	});

	//Portfolio//

	$('.adaptive-one-activate').click(function() {
		$('.portfolio-adaptive').removeClass('adaptive-three');
		$('.portfolio-adaptive').removeClass('adaptive-two');
		$('.portfolio-adaptive').addClass('adaptive-one');
		$(this).addClass('active-adaptive-style');
		$('.adaptive-two-activate, .adaptive-three-activate').removeClass('active-adaptive-style');
		return false;
	});

	$('.adaptive-two-activate').click(function() {
		$('.portfolio-adaptive').removeClass('adaptive-three');
		$('.portfolio-adaptive').addClass('adaptive-two');
		$('.portfolio-adaptive').removeClass('adaptive-one');
		$(this).addClass('active-adaptive-style');
		$('.adaptive-three-activate, .adaptive-one-activate').removeClass('active-adaptive-style');
		return false;
	});

	$('.adaptive-three-activate').click(function() {
		$('.portfolio-adaptive').addClass('adaptive-three');
		$('.portfolio-adaptive').removeClass('adaptive-two');
		$('.portfolio-adaptive').removeClass('adaptive-one');
		$(this).addClass('active-adaptive-style');
		$('.adaptive-two-activate, .adaptive-one-activate').removeClass('active-adaptive-style');
		return false;
	});


	//Close Sharebox//

	$('.open-sharebox').click(function() {
		$('.sharebox-wrapper').fadeIn(200);
	});

	$('.close-sharebox').click(function() {
		$('.sharebox-wrapper').fadeOut(200);
	});

	$('.open-loginbox').click(function() {
		$('.loginbox-wrapper').fadeIn(200);
	});

	$('.close-loginbox').click(function() {
		$('.loginbox-wrapper').fadeOut(200);
	});

	//Checkboxes

	$('.checkbox-one').click(function() {
		$(this).toggleClass('checkbox-one-checked');
		$(this).siblings("input[type='checkbox']").click();

		return false;
	});
	$('.checkbox-two').click(function() {
		$(this).toggleClass('checkbox-two-checked');
		return false;
	});
	$('.checkbox-three').click(function() {
		$(this).toggleClass('checkbox-three-checked');
		return false;
	});
	$('.radio-one').click(function() {
		$(this).toggleClass('radio-one-checked');
		return false;
	});
	$('.radio-two').click(function() {
		$(this).toggleClass('radio-two-checked');
		return false;
	});

    //Switches

    $('.switch-1').click(function(){
       $(this).toggleClass('switch-1-on');
        return false;
    });

    $('.switch-2').click(function(){
       $(this).toggleClass('switch-2-on');
        return false;
    });

    $('.switch-3').click(function(){
       $(this).toggleClass('switch-3-on');
        return false;
    });

    $('.switch, .switch-icon').click(function(){
        $(this).parent().find('.switch-box-content').slideToggle(200);
        $(this).parent().find('.switch-box-subtitle').slideToggle(200);
        return false;
    });


	//Notifications

	$('.tap-dismiss-notification').click(function() {
		$(this).slideUp(200);
		return false;
	});

	$('.close-big-notification').click(function() {
		$(this).parent().slideUp(200);
		return false;
	});

	$('.notification-top').addClass('show-notification-top');

	$('.hide-top-notification').click(function(){
		$('.notification-top').removeClass('show-notification-top');
	});

	//Tabs
	$('.tab-but-1').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-1').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-1').slideDown(200);
		return false;
	});

	$('.tab-but-2').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-2').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-2').slideDown(200);
		return false;
	});

	$('.tab-but-3').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-3').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-3').slideDown(200);
		return false;
	});

	$('.tab-but-4').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-4').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-4').slideDown(200);
		return false;
	});

	$('.tab-but-5').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-5').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-5').slideDown(200);
		return false;
	});

	//Toggles

	$('.deploy-toggle-1').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).toggleClass('toggle-1-active');
		return false;
	});

	$('.deploy-toggle-2').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).toggleClass('toggle-2-active');
		return false;
	});

	$('.deploy-toggle-3').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).find('em strong').toggleClass('toggle-3-active-ball');
		$(this).find('em').toggleClass('toggle-3-active-background');
		return false;
	});

	//Submenu Nav

	$('.submenu-nav-deploy').click(function() {
		$(this).toggleClass('submenu-nav-deploy-active');
		$(this).parent().find('.submenu-nav-items').slideToggle(200);
		return false;
	});

	//Sliding Door

	$('.sliding-door-top').click(function() {
		$(this).animate({
			left:'101%'
		}, 500, 'easeInOutExpo');
		return false;
	});

	$('.sliding-door-bottom a em').click(function() {
		$(this).parent().parent().parent().find('.sliding-door-top').animate({
			left:'0px'
		}, 500, 'easeOutBounce');
		return false

	});

	/////////////////////////////////////////////////////////////////////////////////////////////
	//Detect user agent for known mobile devices and show hide elements for each specific element
	/////////////////////////////////////////////////////////////////////////////////////////////

	var isiPhone = 		navigator.userAgent.toLowerCase().indexOf("iphone");
	var isiPad = 		navigator.userAgent.toLowerCase().indexOf("ipad");
	var isiPod = 		navigator.userAgent.toLowerCase().indexOf("ipod");
	var isiAndroid = 	navigator.userAgent.toLowerCase().indexOf("android");

	if(isiPhone > -1) 	 {		 $('.ipod-detected').hide();		 $('.ipad-detected').hide();		 $('.iphone-detected').show();		 $('.android-detected').hide();	 }
	if(isiPad > -1)	 {		 	 $('.ipod-detected').hide();		 $('.ipad-detected').show();		 $('.iphone-detected').hide();		 $('.android-detected').hide();	 }
	if(isiPod > -1)	 {		 	 $('.ipod-detected').show();		 $('.ipad-detected').hide();		 $('.iphone-detected').hide();		 $('.android-detected').hide();	 }
	if(isiAndroid > -1) {		 $('.ipod-detected').hide();		 $('.ipad-detected').hide();		 $('.iphone-detected').hide();		 $('.android-detected').show();	 }


	//Detect if iOS WebApp Engaged and permit navigation without deploying Safari
	(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")

	var owlStaffControls = $(".staff-slider");
	owlStaffControls.owlCarousel({
		//Basic Stuff
		items : 3,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [980,3],
		itemsTablet: [768,2],
		itemsTabletSmall: [480,1],
		itemsMobile : [370,1],
		singleItem : false,
		itemsScaleUp : false,
		slideSpeed : 250,
		paginationSpeed : 250,
		rewindSpeed : 250,
		pagination:false,
		autoPlay : false,
		autoHeight: false,
	});

	$(".next-staff").click(function(){
	  owlStaffControls.trigger('owl.next');
	  return false;
	});
	$(".prev-staff").click(function(){
	  owlStaffControls.trigger('owl.prev');
	  return false;
	});

	var owlQuoteSlider = $(".quote-slider");
	owlQuoteSlider.owlCarousel({
		items : 1,
		itemsDesktop : [1199,1],
		itemsDesktopSmall : [980,1],
		itemsTablet: [768,1],
		itemsTabletSmall: [480,1],
		itemsMobile : [370,1],
		singleItem : false,
		itemsScaleUp : false,
		slideSpeed : 800,
		paginationSpeed : 300,
		rewindSpeed : 250,
		pagination:false,
		autoPlay : true,
	});

	$(".next-quote").click(function() {
	  owlQuoteSlider.trigger('owl.next');
	  return false;
	});
	$(".prev-quote").click(function() {
	  owlQuoteSlider.trigger('owl.prev');
	  return false;
	});

	/////////////////
	//Image Gallery//
	/////////////////
	$(".swipebox").swipebox({
		useCSS : true, // false will force the use of jQuery for animations
		hideBarsDelay : 3000 // 0 to always show caption and action bar
	});

	$(".wide-gallery-item").swipebox({
		useCSS : true, // false will force the use of jQuery for animations
		hideBarsDelay : 3000 // 0 to always show caption and action bar
	});

	var time = 4; // time in seconds

	var $progressBar,
		$bar,
		$elem,
		isPause,
		tick,
		percentTime;


	//Init the carousel
	$(".homepage-slider").owlCarousel({
		slideSpeed : 500,
		paginationSpeed : 500,
		singleItem : true,
		//pagination:false,
		afterInit : progressBar,
		afterMove : moved,
		startDragging : pauseOnDragging
	});

	//Init progressBar where elem is $("#owl-demo")
	function progressBar(elem){
		$elem = elem;
		//build progress bar elements
		buildProgressBar();
		//start counting
		start();
	}

	//create div#progressBar and div#bar then prepend to $("#owl-demo")
	function buildProgressBar(){
		$progressBar = $("<div>",{
			id:"progressBar"
		});
		$bar = $("<div>",{
			id:"bar"
		});
		$progressBar.append($bar).prependTo($elem);
	}

	function start() {
		//reset timer
		percentTime = 0;
		isPause = false;
		//run interval every 0.01 second
		tick = setInterval(interval, 10);
	};

	function interval() {
		if(isPause === false){
			percentTime += 1 / time;
			$bar.css({
			   width: percentTime+"%"
			 });
			//if percentTime is equal or greater than 100
			if(percentTime >= 100){
			  //slide to next item
			  $elem.trigger('owl.next')
			}
		}
	}

	//pause while dragging
	function pauseOnDragging(){
		isPause = true;
	}

	//moved callback
	function moved(){
		//clear interval
		clearTimeout(tick);
		//start again
		start();
	}


	// Custom Navigation Events
	$(".next-home").click(function() {
		$(".homepage-slider").trigger('owl.next');
		return false;
	});
	$(".prev-home").click(function() {
		$(".homepage-slider").trigger('owl.prev');
		return false;
	});


    var screen_width = 0;
    var screen_height = 0;
    function resize_coverpage(){
        screen_width = $(window).width();
        screen_height = $(window).height();

         $('.coverpage-image').css({
            height: screen_height - 100,
            width: screen_width
        });
    };
    resize_coverpage();
    $(window).resize(resize_coverpage);

	$(".coverpage-slider").owlCarousel({
		slideSpeed : 500,
		paginationSpeed : 500,
		singleItem : true,
		pagination: true,
		afterInit : progressBar,
		afterMove : moved,
		startDragging : pauseOnDragging
	});


	$.scrollIt();

   //Fullscreen Slider Variables
    var screen_width = 0;
    var screen_height = 0;
    function resize_slider(){
        screen_width = $(window).width();
        screen_height = $(window).height();

        if ($('#splash-page.slider-image').length)
        {
        	$('#splash-page.slider-image').css({
	            height: screen_height + 20,
	            width: screen_width
	        });
	    }
	    else
	    {
	        $('.slider-image').css({
	            height: screen_height - 100,
	            width: screen_width
	        });
	    }

	    if ($('.slider-style-1').height() > $('#splash-page').height()) {
	    	$('#splash-page').height($('.slider-style-1').height());
	    }

    };
    resize_slider();
    $(window).resize(resize_slider);

	$(".full-slider").owlCarousel({
		slideSpeed : 500,
		paginationSpeed : 500,
		singleItem : true,
		pagination: true,
		afterInit : progressBar,
		afterMove : moved,
		startDragging : pauseOnDragging
	});


});

}(jQuery));