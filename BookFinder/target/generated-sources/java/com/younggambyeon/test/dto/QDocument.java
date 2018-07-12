package com.younggambyeon.test.dto;

import static com.mysema.query.types.PathMetadataFactory.*;

import com.mysema.query.types.path.*;

import com.mysema.query.types.PathMetadata;
import javax.annotation.Generated;
import com.mysema.query.types.Path;
import com.mysema.query.types.path.PathInits;


/**
 * QDocument is a Querydsl query type for Document
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QDocument extends EntityPathBase<Document> {

    private static final long serialVersionUID = -2147347107L;

    public static final QDocument document = new QDocument("document");

    public final ListPath<String, StringPath> authors = this.<String, StringPath>createList("authors", String.class, StringPath.class, PathInits.DIRECT2);

    public final StringPath barcode = createString("barcode");

    public final StringPath category = createString("category");

    public final StringPath contents = createString("contents");

    public final StringPath datetime = createString("datetime");

    public final StringPath ebook_barcode = createString("ebook_barcode");

    public final StringPath isbn = createString("isbn");

    public final NumberPath<Integer> price = createNumber("price", Integer.class);

    public final StringPath publisher = createString("publisher");

    public final NumberPath<Integer> sale_price = createNumber("sale_price", Integer.class);

    public final StringPath sale_yn = createString("sale_yn");

    public final StringPath status = createString("status");

    public final StringPath thumbnail = createString("thumbnail");

    public final StringPath title = createString("title");

    public final ListPath<String, StringPath> translators = this.<String, StringPath>createList("translators", String.class, StringPath.class, PathInits.DIRECT2);

    public final StringPath url = createString("url");

    public QDocument(String variable) {
        super(Document.class, forVariable(variable));
    }

    public QDocument(Path<? extends Document> path) {
        super(path.getType(), path.getMetadata());
    }

    public QDocument(PathMetadata<?> metadata) {
        super(Document.class, metadata);
    }

}

