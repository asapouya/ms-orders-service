class OrdersController {

    constructor({OrdersService}) {
        this.OrdersService = OrdersService;
    }

    handle_user_deletion = () => {
        this.OrdersService.handle_user_deletion()
    }
    
    finalize_order = (req, res) => {
        this.OrdersService.finalize_order(req, res);
    }

    create_order = async (req, res) => {
        this.OrdersService.create_order(req, res);
    }

    update_order = async (req, res) => {
        this.OrdersService.update_order(req, res);
    }

    delete_order = async (req, res) => {
        this.OrdersService.delete_order(req, res);
    }

    get_order = async (req, res) => {
        this.OrdersService.get_order(req, res);
    }

    get_orders = async (req, res) => {
        this.OrdersService.get_orders(req, res);
    }

}

module.exports = OrdersController