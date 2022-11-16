/* 영화 검색 날짜 */
let dateObj = new Date();
let movieSearch;
if (dateObj.getDate() < 10) {
    movieSearch = String(dateObj.getFullYear()) + String(dateObj.getMonth() + 1) + "0" + String(dateObj.getDate()) - 1;
} else {
    movieSearch = String(dateObj.getFullYear()) + String(dateObj.getMonth() + 1) + String(dateObj.getDate() - 1);
}


/* api 선언부 ---------------------------------------------------------- */

/* 영화진흥위원회 API */

// url : http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json

let api_key_movie = "key=22f10dd3863febae7e67b8df14051d8b"; // API 키
let targetDt = "&targetDt=" + movieSearch;

const movie_url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?" + api_key_movie + targetDt;
const movie_detail_url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?" + api_key_movie + "&movieCd=";
let cnt = 1;
/** 일별 박스오피스 호출 API fetch 함수*/
function callFetchMovie() {
    fetch("api/search/dailyBoxOffice")
        .then(response => response.json())
        .then(function (json) {
            for (let i = json.length - 1; i >= 0 ; i--) {
                let movieJson = json[i].movies;
                console.log(movieJson);

                let plusSection = document.getElementById('section_main_div');

                let new_pTag = document.createElement('p');
                new_pTag.setAttribute('id', 'new_pTag');

                let new_divTag = document.createElement('div');

                let new_aTag = document.createElement('a');
                new_aTag.setAttribute('id', 'new_aTag');
                new_aTag.setAttribute('href', `/movie/${movieJson.movieCd}`);

                let new_pTag_movieRank = document.createElement('p');
                let new_pTag_movieImg = document.createElement('img');
                let new_pTag_movieNm = document.createElement('p');
                let new_pTag_movieOpenDt = document.createElement('p');
                let new_pTag_movieNation = document.createElement('p');

                new_pTag_movieRank.setAttribute('id', 'movie_rank');
                new_pTag_movieNm.setAttribute('id', 'movie_title');
                new_pTag_movieImg.setAttribute('type', 'image');
                new_pTag_movieImg.setAttribute('src', `${movieJson.poster}`);

                new_pTag_movieRank.append(`${cnt}`);
                new_pTag_movieNm.append(`${movieJson.movieNm}`);
                new_pTag_movieOpenDt.append(`${movieJson.openDt.substr(0, 4)}`);
                new_pTag_movieNation.append(`${movieJson.nationAlt}`);

                new_pTag.append(new_pTag_movieRank);
                new_pTag.append(new_pTag_movieImg);
                new_pTag.append(new_pTag_movieNm);
                new_pTag.append(new_pTag_movieOpenDt);
                new_pTag.append(new_pTag_movieNation);
                new_divTag.append(new_pTag);
                new_aTag.append(new_divTag);

                plusSection.appendChild(new_aTag);

                console.log(movieJson.movieCd)
                cnt++;
            } // for end

        }); // second then func end
} // func end

callFetchMovie();