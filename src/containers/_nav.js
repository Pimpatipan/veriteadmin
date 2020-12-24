export default [{
    _name: 'CSidebarNav',
    _children: [
        // {
        //   _name: 'CSidebarNavItem',
        //   name: 'Welcome',
        //   to: '/',
        //   icon: 'cil-star',
        // },
        {
            id: 26,
            _name: 'CSidebarNavItem',
            name: 'DASHBOARD',
            to: '/dashboard',
            icon: 'cil-speedometer'
        },
        {
            id: 27,
            _name: 'CSidebarNavDropdown',
            class: 'aside-menu-show',
            name: 'CONTENT',
            icon: 'cil-list',
            items: [{
                    id: 1,
                    _name: 'CSidebarNavItem',
                    name: 'Banner',
                    to: '/banner',
                    icon: 'cil-satelite',
                },
                {
                    id: 2,
                    _name: 'CSidebarNavItem',
                    name: 'Video',
                    to: '/video',
                    icon: 'cil-video',
                },
                {
                    id: 3,
                    _name: 'CSidebarNavItem',
                    name: 'Beauty Tips',
                    to: '/beautytips',
                    icon: 'cil-user-female',
                },
                {
                    id: 4,
                    _name: 'CSidebarNavItem',
                    name: 'Skin Consultation',
                    to: '/skinconsultation/home',
                    icon: 'cil-user-female',
                },
                {
                    id: 5,
                    _name: 'CSidebarNavItem',
                    name: 'Skin Consultation List',
                    to: '/skinconsultation',
                    icon: 'cil-user-female',
                }
            ]
        },
        {
            id: 28,
            _name: 'CSidebarNavDropdown',
            name: 'CATALOG',
            icon: 'cil-list',
            items: [{
                    id: 6,
                    _name: 'CSidebarNavItem',
                    name: 'Category',
                    to: '/category',
                    icon: 'cil-list',
                },
                {
                    id: 7,
                    _name: 'CSidebarNavItem',
                    name: 'Product',
                    to: '/product',
                    icon: 'cil-gift',
                },
                {
                    id: 8,
                    _name: 'CSidebarNavItem',
                    name: 'Inventory',
                    to: '/inventory',
                    icon: 'cil-clipboard',
                }
            ]
        },
        {
            id: 9,
            _name: 'CSidebarNavItem',
            name: 'PROMOTION',
            to: '/promotion',
            icon: 'cil-list',
        },
        {
            id: 29,
            _name: 'CSidebarNavDropdown',
            name: 'ORDER',
            icon: 'cil-list',
            items: [{
                    id: 10,
                    _name: 'CSidebarNavItem',
                    name: 'Order',
                    to: '/order',
                    icon: 'cil-clipboard',
                },
                {
                    id: 11,
                    _name: 'CSidebarNavItem',
                    name: 'Shipping',
                    to: '/shipping',
                    icon: 'cil-truck',
                },
            ]
        },
        {
            id: 30,
            _name: 'CSidebarNavDropdown',
            name: 'CUSTOMER',
            icon: 'cil-list',
            items: [{
                    id: 12,
                    _name: 'CSidebarNavItem',
                    name: 'User',
                    to: '/user',
                    icon: 'cil-user',
                },
                {
                    id: 13,
                    _name: 'CSidebarNavItem',
                    name: 'Customer Review',
                    to: '/reviews',
                    icon: 'cil-user',
                },
                {
                    id: 14,
                    _name: 'CSidebarNavItem',
                    name: 'Question',
                    to: '/questions',
                    icon: 'cil-comment-bubble',
                }
            ]
        },
        {
            id: 31,
            _name: 'CSidebarNavDropdown',
            name: 'PAYMENT',
            icon: 'cil-list',
            items: [{
                    id: 15,
                    _name: 'CSidebarNavItem',
                    name: 'Bank Account',
                    to: '/bankaccount',
                    icon: 'cil-bank',
                },
                {
                    id: 16,
                    _name: 'CSidebarNavItem',
                    name: 'Payment Channel',
                    to: '/paymentchannel',
                    icon: 'cib-cc-mastercard',
                }
            ]
        },
        {
            id: 32,
            _name: 'CSidebarNavDropdown',
            name: 'MISC',
            icon: 'cil-list',
            items: [{
                    id: 17,
                    _name: 'CSidebarNavItem',
                    name: 'Store',
                    to: '/store',
                    icon: 'cil-basket',
                },
                {
                    id: 18,
                    _name: 'CSidebarNavItem',
                    name: 'Store Type',
                    to: '/storetype',
                    icon: 'cil-home',
                },
                {
                    id: 19,
                    _name: 'CSidebarNavItem',
                    name: 'Other Page',
                    to: '/other',
                    icon: 'cil-square',
                },
                {
                    id: 20,
                    _name: 'CSidebarNavItem',
                    name: 'FAQ',
                    to: '/faq',
                    icon: 'cil-comment-bubble',
                },
                {
                    id: 21,
                    _name: 'CSidebarNavItem',
                    name: 'Career',
                    to: '/career',
                    icon: 'cil-briefcase',
                },
            ]
        },
        {
            id: 33,
            _name: 'CSidebarNavDropdown',
            name: 'SYSTEM',
            icon: 'cil-list',
            items: [{
                    id: 22,
                    _name: 'CSidebarNavItem',
                    name: 'Admin',
                    to: '/admin',
                    icon: 'cil-user',
                },
                {
                    id: 23,
                    _name: 'CSidebarNavItem',
                    name: 'Configuration',
                    to: '/configuration',
                    icon: 'cil-pencil',
                },
                {
                    id: 24,
                    _name: 'CSidebarNavItem',
                    name: 'Notification',
                    to: '/notification',
                    icon: 'cil-pencil',
                },
                {
                    id: 25,
                    _name: 'CSidebarNavItem',
                    name: 'Email',
                    to: '/email',
                    icon: 'cil-pencil',
                }
            ]
        },
        // {
        //     _name: 'CSidebarNavItem',
        //     name: 'Coupon List',
        //     to: '/coupon',
        //     icon: 'cil-dollar',
        // },
        // {
        //     _name: 'CSidebarNavItem',
        //     name: 'Tree',
        //     to: '/template/tree',
        //     icon: 'cil-user',
        // },
        // {
        //   _name: 'CSidebarNavDivider',
        //   _class: 'm-2'
        // },
        // {
        //   _name: 'CSidebarNavTitle',
        //   _children: ['Examples Navbar']
        // },
        // {
        //   _name: 'CSidebarNavDropdown',
        //   name: 'Icons',
        //   route: '/icons',
        //   icon: 'cil-star',
        //   items: [
        //     {
        //       name: 'CoreUI Icons',
        //       to: '/icons/coreui-icons',
        //       icon: 'cil-star',
        //       badge: {
        //         color: 'info',
        //         text: 'NEW'
        //       }
        //     },
        //     {
        //       name: 'Brands',
        //       to: '/icons/brands',
        //       icon: 'cil-star'
        //     },
        //     {
        //       name: 'Flags',
        //       to: '/icons/flags',
        //       icon: 'cil-star'
        //     }
        //   ]
        // },
        // {
        //   _name: 'CSidebarNavItem',
        //   name: 'Widgets',
        //   to: '/widgets',
        //   icon: 'cil-calculator',
        //   badge: {
        //     color: 'primary',
        //     text: 'NEW',
        //     shape: 'pill'
        //   }
        // },
        // {
        //   _name: 'CSidebarNavItem',
        //   name: 'Download CoreUI',
        //   href: 'http://coreui.io/vue/',
        //   icon: { name: 'cil-cloud-download', class: 'text-white' },
        //   _class: 'bg-success text-white',
        //   target: '_blank'
        // },
    ]
}]