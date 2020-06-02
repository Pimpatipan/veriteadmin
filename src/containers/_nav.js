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
            _name: 'CSidebarNavDropdown',
            class:'aside-menu-show',
            name: 'CONTENT',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Banner List',
                    to: '/banner',
                    icon: 'cil-satelite',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Video List',
                    to: '/video',
                    icon: 'cil-video',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Beauty Tips List',
                    to: '/beautytips',
                    icon: 'cil-user-female',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Skin Consultation',
                    to: '/skinconsultation/home',
                    icon: 'cil-user-female',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Skin Consultation List',
                    to: '/skinconsultation',
                    icon: 'cil-user-female',
                }
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'CATALOG',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Category List',
                    to: '/category',
                    icon: 'cil-list',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Product List',
                    to: '/product',
                    icon: 'cil-gift',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Inventory List',
                    to: '/inventory',
                    icon: 'cil-clipboard',
                }
            ]
        },
        // {
        //     _name: 'CSidebarNavItem',
        //     name: 'PROMOTION LIST',
        //     to: '/promotion',
        //     icon: 'cil-list',
        // },
        {
            _name: 'CSidebarNavDropdown',
            name: 'ORDER',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Order List',
                    to: '/order',
                    icon: 'cil-clipboard',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Shipping List',
                    to: '/shipping',
                    icon: 'cil-truck',
                },
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'CUSTOMER',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'User List',
                    to: '/user',
                    icon: 'cil-user',
                },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Customer Review',
                //     to: '/reviews',
                //     icon: 'cil-user',
                // },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Question List',
                //     to: '/questions',
                //     icon: 'cil-comment-bubble',
                // }
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'PAYMENT',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Bank Account List',
                    to: '/bankaccount',
                    icon: 'cil-bank',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Payment Channel List',
                    to: '/paymentchannel',
                    icon: 'cib-cc-mastercard',
                }
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'MISC',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Store List',
                    to: '/store',
                    icon: 'cil-basket',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Store Type List',
                    to: '/storetype',
                    icon: 'cil-home',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Other Page List',
                    to: '/other',
                    icon: 'cil-square',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'FAQ List',
                    to: '/faq',
                    icon: 'cil-comment-bubble',
                },
                {
                    _name: 'CSidebarNavItem',
                    name: 'Career List',
                    to: '/career',
                    icon: 'cil-briefcase',
                },
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'SYSTEM',
            icon: 'cil-list',
            items: [
                {
                    _name: 'CSidebarNavItem',
                    name: 'Admin List',
                    to: '/admin',
                    icon: 'cil-user',
                },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Configuration',
                //     to: '/configuration',
                //     icon: 'cil-pencil',
                // },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Notification',
                //     to: '/notification',
                //     icon: 'cil-pencil',
                // },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Email',
                //     to: '/email',
                //     icon: 'cil-pencil',
                // },
                // {
                //     _name: 'CSidebarNavItem',
                //     name: 'Contact Us',
                //     to: '/contactus',
                //     icon: 'cil-pencil',
                // }
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