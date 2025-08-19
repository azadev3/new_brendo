type Route = {
    en: string;
    ru: string;
};

const ROUTES: { [key: string]: Route } = {
    home: {
        en: 'home',
        ru: 'home',
    },
    about: {
        en: 'about',
        ru: 'about',
    },
    contact: {
        en: 'contact',
        ru: 'contact',
    },
    product: {
        en: 'product',
        ru: 'product',
    },
    login: {
        en: 'login',
        ru: 'login',
    },
    brends: {
        en: 'brends',
        ru: 'brends',
    },
    rules: {
        en: 'rules',
        ru: 'rules',
    },
    deliveryRules: {
        en: 'deliveryRules',
        ru: 'deliveryRules',
    },
    refundRules: {
        en: 'refundRules',
        ru: 'refundRules',
    },
    userSettings: {
        en: 'userSettings',
        ru: 'userSettings',
    },
    orders: {
        en: 'orders',
        ru: 'orders',
    },
    orderdetail: {
        en: 'orderdetail',
        ru: 'orderdetail',
    },
    ordersConfirm: {
        en: 'ordersConfirm',
        ru: 'ordersConfirm',
    },
    liked: {
        en: 'liked',
        ru: 'liked',
    },
    likedUser: {
        en: 'userliked',
        ru: 'userliked',
    },
    notification: {
        en: 'notification',
        ru: 'notification',
    },
    return: {
        en: 'return',
        ru: 'return',
    },
    address: {
        en: 'address',
        ru: 'address',
    },
    order: {
        en: 'order',
        ru: 'order',
    },
    register: {
        en: 'register',
        ru: 'register',
    },
    resetPasword: {
        en: 'resetPasword',
        ru: 'resetPasword',
    },
    resetPaswordSucses: {
        en: 'resetPaswordSucses',
        ru: 'resetPaswordSucses',
    },
    BaskedSucses: {
        en: 'BaskedSucses',
        ru: 'BaskedSucses',
    },
    password_reset_confrim: {
        en: 'password-reset',
        ru: 'password-reset',
    },
};

export const getRouteKey = (searchString: string): string | null => {
    for (const key in ROUTES) {
        if (
            ROUTES[key].en === searchString ||
            ROUTES[key].ru === searchString
        ) {
            return key;
        }
    }
    return null;
};

export default ROUTES;
