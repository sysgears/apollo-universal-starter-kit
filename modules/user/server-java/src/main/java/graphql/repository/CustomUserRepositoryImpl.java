package graphql.repository;

import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class CustomUserRepositoryImpl implements CustomUserRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Async("repositoryThreadPoolTaskExecutor")
    public CompletableFuture<List<User>> users(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);

        Root<User> user = cq.from(User.class);
        List<Predicate> predicates = new ArrayList<>();

        filter.ifPresent(filterUserInput -> {
            filterUserInput.getRole().ifPresent(role -> predicates.add(cb.like(user.get("role"), role)));
            filterUserInput.getIsActive().ifPresent(isActive -> predicates.add(cb.equal(user.get("isActive"), isActive)));
            filterUserInput.getSearchText().ifPresent(searchText -> {
                predicates.add(cb.or((cb.like(user.get("username"), searchText)),
                        cb.like(user.get("email"), searchText)));
            });
        });

        orderBy.ifPresent(orderByUserInput -> {
            String orderColumn = orderByUserInput.getColumn().orElse("id");
            if(orderByUserInput.getOrder().isPresent() && orderByUserInput.getOrder().get().toLowerCase().equals("desc")) {
                cq.orderBy(cb.desc(user.get(orderColumn)));
            } else {
                cq.orderBy(cb.asc(user.get(orderColumn)));
            }
        });

        cq.where(predicates.toArray(new Predicate[0]));

        return CompletableFuture.supplyAsync(() -> em.createQuery(cq).getResultList());
    }
}
