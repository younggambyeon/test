package com.younggambyeon.test.dto;

import static com.mysema.query.types.PathMetadataFactory.*;

import com.mysema.query.types.path.*;

import com.mysema.query.types.PathMetadata;
import javax.annotation.Generated;
import com.mysema.query.types.Path;
import com.mysema.query.types.path.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1293721869L;

    public static final QUser user = new QUser("user");

    public final ListPath<Bookmark, QBookmark> bookmark = this.<Bookmark, QBookmark>createList("bookmark", Bookmark.class, QBookmark.class, PathInits.DIRECT2);

    public final StringPath email = createString("email");

    public final NumberPath<Integer> idx = createNumber("idx", Integer.class);

    public final StringPath password = createString("password");

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata<?> metadata) {
        super(User.class, metadata);
    }

}

