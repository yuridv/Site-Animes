  $(document).click(function(event) {
    if (!event.target.id || (event.target.id !== "searchBarIgnore" && event.target.id !== "searchBarInput")) closeSearch()
  });
  document.getElementById('searchBarInput').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) search(document.getElementById('searchBarInput'))
  });
  function openSearch() {
    document.getElementById('iconSearchBar').style.display = "none"
    document.getElementById('searchBarMenu').style.width = "15%"
    if (window.screen.width < 900) {
    document.getElementById('searchBarMenu').style.width = "55%"
      document.getElementById('searchBarMenu').style.top = "10%"
      document.getElementById('searchBarMenu').style.right = "6%"
    }
    $("#searchBar").fadeIn(500)
  }
  function closeSearch() {
    document.getElementById("searchBar").style.display = "none"
    document.getElementById("animeSearch").style.display = "none"
    if (window.screen.width < 900) {
      document.getElementById('searchBarMenu').style.width = "10%"
      document.getElementById('searchBarMenu').style.top = "3.2%"
      document.getElementById('searchBarMenu').style.right = "20%"
    }
    document.getElementById("iconSearchBar").style.display = "inline"
  }
  var searchAnimesBar = 0
  function loadAnimesBar(anime) {
    if (anime.length < 3) return document.getElementById("animeSearch").style.display = "none";
    searchAnimesBar += 1
    var aux = searchAnimesBar
    document.getElementById('animeSearch').innerHTML = `<div style="position: relative; width: 100%; height: 7vh;"><div style="position: absolute; top: 40%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
    if (!anime) return $('#animeSearch').fadeOut(800)
    $('#animeSearch').fadeIn(800)
    anime = anime.replace(" ","+")
    $.ajax({ method: "post", url: `/loadSearch`,
      data: { anime: `${anime}`, page: 1 },
      success: function(s) {
        if (aux !== searchAnimesBar) return;
        document.getElementById('animeSearch').innerHTML = ``
        if (s && s.animes && s.animes.length > 0) {
          s.animes.forEach((anime, index)=>{ document.getElementById('animeSearch').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" title="${anime.name}" class="calendarMain" style="cursor: pointer; margin-inline: 4%; display: flex; width: 92%; height: 10vh; background: rgba(10,10,10); margin-block: 1vh; border-radius: 0.8vh;"><div style="width: 20%; height: 8vh; margin-top:1vh; margin-left: 1vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 0.6vh;"><div style="background: linear-gradient(to bottom,rgba(10,10,10, 1) 0%,rgba(10,10,10, 0.1) 10%,rgba(10,10,10, 0.1) 90%,rgba(10,10,10, 1) 100%);"></div></div><div style="position: relative; width: 100%; height: 100%;"><div style="position: absolute; bottom: 1vh; left: 2vh; right: 5vh"><a class="font-3" style="font-size: 2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; color:red; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.type}</a><a class="font-3" style="font-size: 1.9vh; color:gray; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div><div style="position: absolute; bottom: 1vh; right: 1vh;"><div style="font-size: 3.5vh; color: red"><i class="fad fa-play-circle"></i></div></div></div></div>` })
        } else { $('#animeSearch').fadeOut(800) }
      },
      error: function(e) {
        if (aux !== searchAnimesBar) return;
        $('#animeSearch').fadeOut(800)
      } 
    })
  }
  function search(input) {
    if (input.value.length < 1) return;
    closeSearch()
    window.location = `/search/${input.value.replace(" ","+")}`
  }