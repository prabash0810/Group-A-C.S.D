// Basic jQuery examples for the webpage
// Requires jQuery to be included in the HTML before this script

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
