import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () =>
    import('@/containers/TheContainer')

// Views
// const Home = () => import('@/views/pages/home/Home')


const Welcome = () =>
    import('@/views/pages/Welcome')
const Page404 = () =>
    import('@/views/pages/Page404')
const Page500 = () =>
    import('@/views/pages/Page500')
const Login = () =>
    import('@/views/pages/Login')
const BannerIndex = () =>
    import('@/views/pages/banner/Index')
const VideoIndex = () =>
    import('@/views/pages/video/Index')
const BeautytipsIndex = () =>
    import('@/views/pages/beautytips/Index')
const PressIndex = () =>
    import('@/views/pages/press/Index')
const CareerIndex = () =>
    import('@/views/pages/career/Index')
const StoreIndex = () =>
    import('@/views/pages/store/Index')
const TransactionIndex = () =>
    import('@/views/pages/transaction/Index')
const UserIndex = () =>
    import('@/views/pages/user/Index')
const BankAccountIndex = () =>
    import('@/views/pages/bankaccount/Index')
const ShippingIndex = () =>
    import('@/views/pages/shipping/Index')
const CouponIndex = () =>
    import('@/views/pages/coupon/Index')
const FaqIndex = () =>
    import('@/views/pages/faq/Index')
const StoreTypeIndex = () =>
    import('@/views/pages/storetype/Index')
const PaymentChannelIndex = () =>
    import('@/views/pages/paymentchannel/Index')
const ProductIndex = () =>
    import('@/views/pages/product/Index')
const AdminIndex = () =>
    import('@/views/pages/admin/Index')
const SkinConsultationIndex = () =>
    import('@/views/pages/skinconsultation/Index')
const CategoryIndex = () =>
    import('@/views/pages/category/Index')
const OtherIndex = () =>
    import('@/views/pages/other/Index')
const InventoryIndex = () =>
    import('@/views/pages/inventory/Index')
const QuestionIndex = () =>
    import('@/views/pages/question/Index')
const SkinConsultationHomeIndex = () =>
    import('@/views/pages/skinconsultation/Home')
const PromotionIndex = () =>
    import('@/views/pages/promotion/Index')
const PromitionDetails = () =>
    import('@/views/pages/promotion/Details')
const OtherDetails = () =>
    import('@/views/pages/other/Details')
const SkinConsultationDetails = () =>
    import('@/views/pages/skinconsultation/Details')
const AdminDetails = () =>
    import('@/views/pages/admin/Details')
const BannerDetails = () =>
    import('@/views/pages/banner/Details')
const TransactionDetails = () =>
    import('@/views/pages/transaction/Details')
const VideoDetails = () =>
    import('@/views/pages/video/Details')
const BeautytipsDetails = () =>
    import('@/views/pages/beautytips/Details')
const CareerDetails = () =>
    import('@/views/pages/career/Details')
const StoreDetails = () =>
    import('@/views/pages/store/Details')
const UserDetails = () =>
    import('@/views/pages/user/Details')
const BankAccountDetails = () =>
    import('@/views/pages/bankaccount/Details')
const ShippingDetails = () =>
    import('@/views/pages/shipping/Details')
const CouponDetails = () =>
    import('@/views/pages/coupon/Details')
const FaqDetails = () =>
    import('@/views/pages/faq/Details')
const StoreTypeDetails = () =>
    import('@/views/pages/storetype/Details')
const ProductDetails = () =>
    import('@/views/pages/product/Details')
const CategoryDetails = () =>
    import('@/views/pages/category/Details')
const FaqQuestionDetails = () =>
    import('@/views/pages/faq/QuestionDetails')
const PaymentChannelDetails = () =>
    import('@/views/pages/paymentchannel/Details')
const InventoryImportData = () =>
    import('@/views/pages/inventory/ImportData')
const ProductImportData = () =>
    import('@/views/pages/product/ImportData')
const Configuration = () =>
    import('@/views/pages/configuration/Index')
const Notification = () =>
    import('@/views/pages/configuration/Notification')
const Email = () =>
    import('@/views/pages/configuration/Email')
const Contactus = () =>
    import('@/views/pages/configuration/Contactus')
const UserReviewList = () =>
    import('@/views/pages/user/Reviews')

const TreeTable = () =>
    import('@/views/template/TreeTable')

Vue.use(Router)

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior: () => ({ y: 0 }),
    routes: configRoutes()
})

function configRoutes() {
    return [{
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        redirect: '/order',
        name: 'Home',
        component: TheContainer,
        meta: { requiresAuth: true },
        children: [{
            path: '/',
            name: 'Index',
            component: TransactionIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/banner',
            name: 'Banner',
            component: BannerIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/video',
            name: 'Video',
            component: VideoIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/beautytips',
            name: 'Beauty Tips',
            component: BeautytipsIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/career',
            name: 'Career List',
            component: CareerIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/store',
            name: 'Store List',
            component: StoreIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/order',
            name: 'Order List',
            component: TransactionIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/user',
            name: 'User List',
            component: UserIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/bankaccount',
            name: 'Bank Account List',
            component: BankAccountIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/shipping',
            name: 'Shipping List',
            component: ShippingIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/coupon',
            name: 'Coupon List',
            component: CouponIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/faq',
            name: 'FAQ List',
            component: FaqIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/storetype',
            name: 'Store Type List',
            component: StoreTypeIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/paymentchannel',
            name: 'Payment Channel List',
            component: PaymentChannelIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/product',
            name: 'Product List',
            component: ProductIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'Admin List',
            component: AdminIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/skinconsultation',
            name: 'Skin Consultation List',
            component: SkinConsultationIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/category',
            name: 'Category List',
            component: CategoryIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/other',
            name: 'Other Page List',
            component: OtherIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/inventory',
            name: 'Inventory List',
            component: InventoryIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/questions',
            name: 'Question List',
            component: QuestionIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/skinconsultation/home',
            name: 'Skin Consultation',
            component: SkinConsultationHomeIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/promotion',
            name: 'Promotion List',
            component: PromotionIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/promotion/details/:id',
            name: 'Promotion Details',
            component: PromitionDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/other/details/:id',
            name: 'Other Page Details',
            component: OtherDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/skinconsultation/details/:id',
            name: 'Skin Consultation Details',
            component: SkinConsultationDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin/details/:id',
            name: 'Admin Details',
            component: AdminDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/banner/details/:id',
            name: 'Banner Details',
            component: BannerDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/order/details/:id',
            name: 'Order Details',
            component: TransactionDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/video/details/:id',
            name: 'Video Details',
            component: VideoDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/beautytips/details/:id',
            name: 'Beauty Tips Details',
            component: BeautytipsDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/career/details/:id',
            name: 'Career Details',
            component: CareerDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/store/details/:id',
            name: 'Store Details',
            component: StoreDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/details/:id',
            name: 'User Details',
            component: UserDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/bankaccount/details/:id',
            name: 'Bank Account Details',
            component: BankAccountDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/shipping/details/:id',
            name: 'Shipping Details',
            component: ShippingDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/template/tree',
            name: 'template tree',
            component: TreeTable,
        },
        {
            path: '/coupon/details/:id',
            name: 'Coupon Details',
            component: CouponDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/faq/details/:id',
            name: 'FAQ Details',
            component: FaqDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/storetype/details/:id',
            name: 'Store Type Details',
            component: StoreTypeDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/product/details/:id',
            name: 'Product Details',
            component: ProductDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/category/details/:id',
            name: 'Category Details',
            component: CategoryDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/test',
            name: 'test List',
            component: PressIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/faq/details/question/:id',
            name: 'Question Details',
            component: FaqQuestionDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/paymentchannel/details/:id',
            name: 'Payment Channel Details',
            component: PaymentChannelDetails,
            meta: { requiresAuth: true }
        },
        {
            path: '/product/importdata',
            name: 'Import Product Data',
            component: ProductImportData,
            meta: { requiresAuth: true }
        },
        {
            path: '/inventory/importdata',
            name: 'Import Inventory Data',
            component: InventoryImportData,
            meta: { requiresAuth: true }
        },
        {
            path: '/configuration',
            name: 'Configuration',
            component: Configuration,
            meta: { requiresAuth: true }
        },
        {
            path: '/notification',
            name: 'Notification',
            component: Notification,
            meta: { requiresAuth: true }
        },
        {
            path: '/email',
            name: 'Email',
            component: Email,
            meta: { requiresAuth: true }
        },
        {
            path: '/contactus',
            name: 'Contact Us',
            component: Contactus,
            meta: { requiresAuth: true }
        },
        {
            path: '/reviews',
            name: 'Customer Review',
            component: UserReviewList,
            meta: { requiresAuth: true }
        },
        // {
        //   path: '/',
        //   redirect: '/',
        //   name: 'Theme',
        //   component: {
        //     render(c) { return c('router-view') }
        //   },
        //   children: [
        //     {
        //       path: '/',
        //       name: 'Home',
        //       component: Home
        //     },
        //   ]
        // },
        {
            path: '404',
            name: 'Page404',
            component: Page404
        },
        {
            path: '500',
            name: 'Page500',
            component: Page500
        },
        {
            path: '*',
            name: 'Page-404',
            component: Page404
        },
        ]
    },
    ]
}