// AUTH ENDPOINTS
export const AUTH = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER: "/auth/user/:id",
};

// CATEGORIES ENDPOINTS
export const CATEGORIES = {
    CREATE: "/categories",
    CREATE_TRANSLATION: "/categories/:id/translations",
    UPDATE: "/categories",
    DELETE: "/categories",
    GET_BY_ID: "/categories/:id",
    GET_BY_SLUG: "/categories/slug/:slug",
    GET_TRANSLATIONS: "/categories/translations/:translationGroupId",
    GET_ALL: "/categories/all",
};

// DESTINATIONS ENDPOINTS
export const DESTINATIONS = {
    CREATE: "/destinations",
    CREATE_TRANSLATION: "/destinations/:id/translations",
    CREATE_MULTI_LANGUAGE: "/destinations/multi-language",
    UPDATE_MULTI_LANGUAGE: "/destinations/multi-language",
    UPDATE: "/destinations/:id",
    DELETE: "/destinations",
    GET_BY_SLUG: "/destinations/slug/:slug",
    GET_TRANSLATIONS: "/destinations/translations/:translationGroupId",
    GET_ALL: "/destinations",
    GET_FEATURED: "/destinations/featured",
    GET_BY_COUNTRY: "/destinations/country/:country",
    GET_BY_CITY: "/destinations/city/:city",
};

// TOURS ENDPOINTS
export const TOURS = {
    CREATE: "/tours",
    CREATE_TRANSLATION: "/tours/:id/translations",
    CREATE_MULTI_LANGUAGE: "/tours/multi-language",
    UPDATE_MULTI_LANGUAGE: "/tours/multi-language",
    UPDATE: "/tours/:id",
    PUBLISH: "/tours/:id/publish",
    ARCHIVE: "/tours/:id/archive",
    DELETE: "/tours",
    GET_BY_SLUG: "/tours/slug/:slug",
    GET_TRANSLATIONS: "/tours/translations/:translationGroupId",
    GET_ALL: "/tours",
    GET_BY_STATUS: "/tours/status/:status",
    GET_BY_DESTINATION: "/tours/destination/:destinationId",
    GET_PUBLISHED_BY_DESTINATION: "/tours/destination/:destinationId/published",
    GET_FEATURED: "/tours/featured",
    GET_FEATURED_PUBLISHED: "/tours/featured/published",
    GET_BY_TAG: "/tours/tag/:tag",
    GET_PUBLISHED_BY_TAG: "/tours/tag/:tag/published",
};

// POSTS ENDPOINTS
export const POSTS = {
    CREATE: "/posts",
    CREATE_TRANSLATION: "/posts/translations/:originId",
    UPDATE: "/posts",
    PUBLISH: "/posts/:id/publish",
    DELETE: "/posts",
    GET_BY_SLUG: "/posts/slug/:slug",
    GET_TRANSLATIONS: "/posts/translations/:groupId",
    GET_ALL: "/posts/all",
    GET_DETAIL: "/posts/detail",
    GET_PUBLISHED: "/posts/published",
};

// REVIEWS ENDPOINTS
export const REVIEWS = {
    CREATE: "/reviews",
    UPDATE: "/reviews/:id",
    APPROVE: "/reviews/:id/approve",
    REJECT: "/reviews/:id/reject",
    DELETE: "/reviews/:id",
    GET_ALL: "/reviews",
    GET_BY_ID: "/reviews/:id",
    GET_BY_TOUR_ID: "/reviews/tour/:tourId",
    GET_APPROVED_BY_TOUR_ID: "/reviews/tour/:tourId/approved",
    GET_BY_COMPANY_ID: "/reviews/company/:companyId",
    GET_APPROVED_BY_COMPANY_ID: "/reviews/company/:companyId/approved",
    GET_APPROVED_BY_TYPE: "/reviews/type/:type/approved",
};

// SETTINGS ENDPOINTS
export const SETTINGS = {
    CREATE: "/settings",
    UPDATE: "/settings",
    GET: "/settings",
    RESET: "/settings/reset",
};


//HOME SECTION ENDPOINTS
export const HOME = {
    GET_HERO: "/home-hero-section",
    UPDATE_HERO: "/home-hero-section",
    GET_SERVICES_HIGHLIGHT: "/service-highlights-section",
    UPDATE_SERVICES_HIGHLIGHT: "/service-highlights-section",
}