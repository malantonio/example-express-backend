$('button').on('click', function () {
  var url = $('input').val()
  console.log(url)
  // clear out the message div
  $('.message').html('')

  if (!url || url === '') return

  // data to send
  var data = {
    full_url: url
  }

  $.ajax({
    type: 'POST',
    url: '/api/urls',
    data: data,
    dataType: 'json',
    success: function (data) {
      var url = data.short_url
      var msg = 'Your short url is <a href="' + url + '">' + url + '</a>'
      $('input').val('')
      $('.message').html(msg)
    }
  })
})