package com.ikos23.app.resource;

import com.ikos23.app.entity.Game;
import com.ikos23.app.entity.Move;
import com.ikos23.app.entity.Player;
import com.ikos23.app.repository.GameRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestResponse;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.function.Function;

@Path("/api/games")
@ApplicationScoped
public class GameResource {
    private final GameRepository gameRepository;

    public GameResource(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @GET
    @Path("{id}")
    public Uni<RestResponse<Game>> getById(@RestPath("id") Long id) {
        Function<Optional<Game>, RestResponse<Game>> toRestResponse = maybeValue ->
                maybeValue
                        .map(val -> RestResponse.ResponseBuilder.ok(val).build())
                        .orElse(RestResponse.ResponseBuilder.<Game>notFound().build());

        return Panache.withSession(() ->
                gameRepository
                        .findById(id)
                        .map(Optional::ofNullable)
                        .map(toRestResponse));
    }

    @POST
    @Path("/new")
    public Uni<Game> newGame() {
        return Panache.withTransaction(() -> {
            var game = new Game();
            game.setName("Game " + LocalDateTime.now());
            game.addPlayer(new Player("Foo"));
            game.addPlayer(new Player("Bar"));

            return gameRepository.persist(game);
        });
    }

    @PUT
    @Path("/{gameId}/players/{playerId}")
    public Uni<Game> nextMove(@RestPath("gameId") Long gameId,
                              @RestPath("playerId") Long playerId,
                              Move move) {
        return Panache.withTransaction(() -> gameRepository
                .findById(gameId)
                .onItem()
                .call(game -> {
                    var player = game.getPlayers()
                            .stream()
                            .filter(p -> p.getId().equals(playerId))
                            .findAny();
                    if (player.isPresent()) {
                        player.get().addMove(move);
                    }

                    return Uni.createFrom().item(game);
                }));
    }
}
