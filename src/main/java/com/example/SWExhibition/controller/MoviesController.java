package com.example.SWExhibition.controller;

import com.example.SWExhibition.dto.CommentResponseDto;
import com.example.SWExhibition.entity.Movies;
import com.example.SWExhibition.repository.RatingsRepository;
import com.example.SWExhibition.repository.UsersRepository;
import com.example.SWExhibition.security.PrincipalDetails;
import com.example.SWExhibition.service.MoviesService;
import com.example.SWExhibition.service.Movies_has_genresService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MoviesController {

    private final MoviesService moviesService;
    private final Movies_has_genresService movies_has_genresService;
    private final RatingsRepository ratingsRepository;
    private final UsersRepository usersRepository;

    // 영화 상세 페이지
    @GetMapping("/movie/{movieCd}")
    public String show(@PathVariable String movieCd, Model model) {
        Movies movie = moviesService.show(movieCd); // DB에서 데이터를 가져옴
        String genres = movies_has_genresService.getGenres(movie);   // 해당 영화와 매핑된 장르 정보들 불러오기
        String openYear = "미개봉";    // 개봉년도 디폴트 값

        // 연도만 표시
        if (movie.getOpenDt() != null && !movie.getOpenDt().equals(""))
            openYear = movie.getOpenDt().substring(0, 4);

        // View에 데이터 값 전달
        model.addAttribute("movieInfo", movie);
        model.addAttribute("genres", genres);
        model.addAttribute("openYear", openYear);

        return "/movie/movie";
    }

    @GetMapping("/movie/{movieCd}")
    public String read(@PathVariable String movieCd, @AuthenticationPrincipal PrincipalDetails user, Model model) {
        Movies dto = moviesService.show(movieCd);
        List<CommentResponseDto> comments = (List<CommentResponseDto>) dto.getComments();

        /* 댓글 관련 */
        if (comments != null && !comments.isEmpty()) {
            model.addAttribute("comments", comments);
        }

        /* 사용자 관련 */
        if (user != null) {
            model.addAttribute("user", user.getNickname());

            /*게시글 작성자 본인인지 확인*/
            if (dto.getComments().getUser().equals(user.getNickname())) {
                model.addAttribute("writer", true);
            }
            for (int i = 0; i < comments.size(); i++) {
                //댓글 작성자 id와 현재 사용자 id를 비교해 true/false 판단
                boolean isWriter = comments.get(i).getNickname().equals(user.getNickname());
                log.info("isWriter? : " + isWriter);
                model.addAttribute("isWriter",isWriter);
            }
        }
        model.addAttribute("movie", dto);
        return "/movie/movie";
    }

}
