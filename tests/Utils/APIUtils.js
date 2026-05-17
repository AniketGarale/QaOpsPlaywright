class APIUtils
{
    constructor(apiContext, loginPayload)
    {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
    
    async getToken(){
        const LoginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', 
                {
                data: this.loginPayload
                });
                const LoginResponseJson = await LoginResponse.json();
                const token = LoginResponseJson.token;
                console.log(token);
                return token;
    }

    async createOrder(orderPayload)
    {   
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', 
                {
                data: orderPayload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': response.token //token
                }
                });
                const orderResponseJson = await orderResponse.json();
                const orderId = orderResponseJson.orders[0];
                response.orderId = orderId;
                console.log(orderId);
                return response;
    }
}

module.exports = {APIUtils};