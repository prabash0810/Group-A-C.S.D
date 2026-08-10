// Document ready shorthand
$(function() {
    // Example: toggle a navigation menu with id "nav"
    $(document).on('click', '#nav-toggle', function(e) {
        e.preventDefault();
        $('#nav').slideToggle(200);
    });


    // Example: highlight form inputs on focus
    $(document).on('focus', 'input, textarea', function() {
        $(this).addClass('focused');
    }).on('blur', 'input, textarea', function() {
        $(this).removeClass('focused');
    });


    // Example: simple AJAX GET to fetch JSON and render into an element with id "results"
    $('#load-data').on('click', function(e) {
        e.preventDefault();
        var url = $(this).data('url') || '/api/data';
        $.getJSON(url)
            .done(function(data) {
                var html = '';
                if (Array.isArray(data)) {
                    data.forEach(function(item) {
                        html += '<div class="item">' + (item.name || JSON.stringify(item)) + '</div>';
                    });
                } else {
                    html = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                }
                $('#results').html(html);
            })
            .fail(function() {
                $('#results').html('<div class="error">Failed to load data.</div>');
            });
    });


    // Utility: simple form validation on submit for forms with class "validate"
    $(document).on('submit', 'form.validate', function(e) {
        var valid = true;
        $(this).find('[required]').each(function() {
            if (!$(this).val()) {
                valid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        if (!valid) {
            e.preventDefault();
            alert('Please fill in required fields.');
        }
    });
});


// Helper: safe console.log wrapper
window.log = function() {
    if (window.console && console.log) console.log.apply(console, arguments);
};

function goTo(idx){
  slidesEl[current].classList.remove('active');
  dotEls[current].classList.remove('active');
  current = (idx + total) % total;
  slidesEl[current].classList.add('active');
  dotEls[current].classList.add('active');
}
var BASE_INTERVAL = 4200;
var timer = null;

function tick(){ goTo(current + 1); }

function resetTimer(){
  if (timer) clearInterval(timer);
  var interval = BASE_INTERVAL * (paused ? 3.2 : 1);
  timer = setInterval(tick, interval);
}
resetTimer();
for (var i = 0; i < total; i++){
  var d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', (function(idx){
    return function(){ goTo(idx); resetTimer(); };
  })(i));
  dotsWrap.appendChild(d);
}
window.__daywiseSlideshowFocus = function(on){
  paused = on;
  resetTimer();
};

function setFocus(on){
  if (on === active) return;
  active = on;
  root.style.setProperty('--speed-scale', on ? '3' : '1');
  root.style.setProperty('--stage-blur', on ? '6px' : '0px');
  root.style.setProperty('--stage-dim', on ? '0.42' : '0');
  if (window.__daywiseSlideshowFocus) window.__daywiseSlideshowFocus(on);
}
card.addEventListener('mouseenter', function(){ setFocus(true); });