package graphql.repository;

import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserRepositoryImpl implements CustomUserRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> users(OrderByUserInput orderBy, FilterUserInput filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);

        Root<User> user = cq.from(User.class);
        List<Predicate> predicates = new ArrayList<>();

        if(filter != null) {
            if(filter.getRole() != null) {
                predicates.add(cb.like(user.get("role"), filter.getRole()));
            }

            if(filter.getIsActive() != null) {
                predicates.add(cb.equal(user.get("isActive"), filter.getIsActive()));
            }

            if(filter.getSearchText() != null) {
                predicates.add(cb.or((cb.like(user.get("username"), filter.getSearchText())),
                        cb.like(user.get("email"), filter.getSearchText())));
            }
        }

        if(orderBy != null) {
            String orderColumn = orderBy.getColumn() != null ? orderBy.getColumn() : "id";
            if(orderBy.getOrder() != null && orderBy.getOrder().toLowerCase().equals("desc")) {
                cq.orderBy(cb.desc(user.get(orderColumn)));
            } else {
                cq.orderBy(cb.asc(user.get(orderColumn)));
            }
        }

        cq.where(predicates.toArray(new Predicate[0]));

        return em.createQuery(cq).getResultList();
    }
}
