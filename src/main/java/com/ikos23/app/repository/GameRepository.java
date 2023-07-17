package com.ikos23.app.repository;

import com.ikos23.app.entity.Game;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class GameRepository implements PanacheRepositoryBase<Game, Long> {
}
