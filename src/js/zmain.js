(function($, window, undefined) {
  // Menu
  $('#menu').click(function() {
    $('body').addClass('push-menu-to-right');
    $('#sidebar').addClass('open');
    $('.overlay').addClass('show');
  });

  $('#mask').click(function() {
    $('body').removeClass('push-menu-to-right');
    $('#sidebar').removeClass('open');
    $('.overlay').removeClass('show');
  });

  // Search
  var bs = {
    close: $('.icon-remove-sign'),
    searchform: $('.search-form'),
    canvas: $('body'),
    dothis: $('.dosearch')
  };

  bs.dothis.on('click', function() {
    $('.search-wrapper').toggleClass('active');
    bs.searchform.toggleClass('active');
    bs.searchform.find('input').focus();
    bs.canvas.toggleClass('search-overlay');
    $('.search-field').simpleJekyllSearch();
  });

  function close_search() {
    $('.search-wrapper').toggleClass('active');
    bs.searchform.toggleClass('active');
    bs.canvas.removeClass('search-overlay');
  }

  bs.close.on('click', close_search);

  // Closing menu with ESC
  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 27 && $('.search-overlay').length) {
      close_search();
    }
  });

  if (document.getElementsByClassName('home').length >= 1) {
    new AnimOnScroll(document.getElementById('grid'), {
      minDuration: 0.4,
      maxDuration: 0.7,
      viewportFactor: 0.2
    });
  }

  smoothScroll.init({
    selectorHeader: '.bar-header', // Selector for fixed headers (must be a valid CSS selector)
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    updateURL: false // Boolean. Whether or not to update the URL with the anchor hash on scroll
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }

  var messaging = firebase.messaging();
  messaging.usePublicVapidKey(
    'BCPMmXHYS2_ynQAcVaHiV4p0iYVQnudc-0kD24xPWytY1zFOmvRl7cg6vNoOfjUO8lFHr-OyncRt5UU06G-BUdM'
  );

  // 申请获得推送权限
  messaging
    .requestPermission()
    .then(function() {
      messaging
        .getToken()
        .then(function(currentToken) {
          if (currentToken) {
            if (window.localStorage.getItem('firebaseTokenSentToServer') != 1) {
              firebase
                .database()
                .ref('messagetokens')
                .push()
                .set(currentToken);
              window.localStorage.setItem('firebaseTokenSentToServer', 1);
            } else {
            }
          } else {
            // Show permission UI.
            // updateUIForPushPermissionRequired();
            window.localStorage.setItem('firebaseTokenSentToServer', 0);
          }
        })
        .catch(function(err) {
          // showToken('Error retrieving Instance ID token. ', err);
          window.localStorage.setItem('firebaseTokenSentToServer', 0);
        });
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
})(Zepto, window);
