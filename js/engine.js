var access_token = null
var token = null

$(document).ready(() => {

  $("#s0, #s1, #s2, #s3").hide()

  access_token = new URLSearchParams(window.location.search).get("code")
  if(access_token){
    if(getCookie("token")){
      getToken(access_token)
      getTopArtists()
      getTopTracks()
      getUserInfo()
      $(".button").hide()
    } else {
      getToken(access_token)
    }
  }
})

function getUserInfo(){
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      type: 'GET',
      headers: {
        Authorization: "Bearer " + getCookie("token"),
      },
      success: function(res) {
        $("#profilePic img").attr({"src": res.images[0].url})
        $("#profilePic").show()
        if(res.product == "premium"){
          $(".premium").show()
        }
      },
      error: function(xhr, err) {}
	});
}
function getTopTracks(){
  $.ajax({
    url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function(res) {
      $("#t3").attr({"src": res.tracks.items[0].track.album.images[0].url})
      $("#t2").attr({"src": res.tracks.items[1].track.album.images[0].url})
      $("#t1").attr({"src": res.tracks.items[2].track.album.images[0].url})
      $("#t0").attr({"src": res.tracks.items[3].track.album.images[0].url})

    },
    error: function(xhr, err) {
    }
});
}

function getTopArtists(){
  $.ajax({
    url: 'https://api.spotify.com/v1/playlists/37i9dQZF1DXaMu9xyX1HzK',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function(res) {
      $("#a0").attr({"src": res.tracks.items[0].track.album.images[0].url})
      $("#a1").attr({"src": res.tracks.items[1].track.album.images[0].url})
      $("#a2").attr({"src": res.tracks.items[2].track.album.images[0].url})
      $("#a3").attr({"src": res.tracks.items[3].track.album.images[0].url})
    },
    error: function(xhr, err) {
    }
});
}

function debounce(func, wait, immediate=false) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function searchItem(query){
  if(query == ""){
    $("#s0, #s1, #s2, #s3").hide()
    return false
  }
  $.ajax({
    url: 'https://api.spotify.com/v1/search?q=' + encodeURI(query) + "&type=track&limit=4",
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function(res) {
      
      $("#s0, #s1, #s2, #s3").show()

      $("#s0 h").html(res.tracks.items[0].artists[0].name)
      $("#s1 h").html(res.tracks.items[1].artists[0].name)
      $("#s2 h").html(res.tracks.items[2].artists[0].name)
      $("#s3 h").html(res.tracks.items[3].artists[0].name)

      $("#s0 p").html(res.tracks.items[0].name)
      $("#s1 p").html(res.tracks.items[1].name)
      $("#s2 p").html(res.tracks.items[2].name)
      $("#s3 p").html(res.tracks.items[3].name)

      $("#s0 img").attr({"src": res.tracks.items[0].album.images[0].url})
      $("#s1 img").attr({"src": res.tracks.items[1].album.images[0].url})
      $("#s2 img").attr({"src": res.tracks.items[2].album.images[0].url})
      $("#s3 img").attr({"src": res.tracks.items[3].album.images[0].url})

      $("#s0").attr({"trackID": res.tracks.items[0].id})
      $("#s1").attr({"trackID": res.tracks.items[1].id})
      $("#s2").attr({"trackID": res.tracks.items[2].id})
      $("#s3").attr({"trackID": res.tracks.items[3].id})


    },
    error: function(xhr, err) {
    }
});
}

function auth(){
  window.open("https://accounts.spotify.com/authorize?client_id=32fdebd51c4247299b13bb65ee1f9cba&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:5500%2Fhtml%2F&scope=user-read-private%20user-read-email%20user-top-read&state=34fFs29kd09&show_dialog=true", target="_self")
}

function myFunction() {
    document.getElementById("myDropdown").classList.add("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = $("#myDropdown a h").text();
      sonValue = $("#myDropdown a p").text();
      if ((txtValue.toUpperCase().indexOf(filter) > -1) || (sonValue.toUpperCase().indexOf(filter) > -1)) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getRecommendations(el){
  $(".popular, .disk, .banner, .search-bar").hide()
  $(".songDkn").show()
  $.ajax({
    url: 'https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=' + $(el).attr("trackID") + '&min_popularity=50',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
    success: function(res) {
      console.log(res)
      $(".wrap").append('<h class="number">We have picked <span>' + 20 + '</span> songs that we think you will like</h>')
      for(var i = 0; i < 20; i++){
        $(".wrap").append('<div id="l' + i + '"></div>')
      }
      setTimeout(() => {
        $(".wrap").fadeIn()
      }, 500)
    },
    error: function(xhr, err) {
      console.log(xhr)
      console.log(err)
    }
  });
}

function getToken(code){
  $.ajax({
    url: 'https://accounts.spotify.com/api/token',
    type: 'POST',
    data: {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:5500/html/",
        "client_id": "32fdebd51c4247299b13bb65ee1f9cba",
        "client_secret": "605d2b8033584c1484cb325490a9a3dc"
    },
    success: function(res) {
      setCookie("token", res.access_token)
      console.log(res)
      getUserInfo()
    },
    error: function(xhr, err) {
      console.log(xhr)
      console.log(err)
    }
  });
}