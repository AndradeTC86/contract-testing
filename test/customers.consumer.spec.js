import 'dotenv/config'

import { Pact } from '@pact-foundation/pact'
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { customerList } from '../request/customer.request';

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Customer Test', () => {
    beforeAll(async () => {
        await mockProvider.setup().then(() => {
            mockProvider.addInteraction({
                uponReceiving: 'a request',
                withRequest:{
                    method: 'POST',
                    path: '/graphql',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjUwMzE5ODE4LCJleHAiOjE2NTA0OTI2MTh9.rzhvcqRBk3c0C09f3A08I9RRRseV_GGEpT2HRcU76C0',
                        "Content-Type": 'application/json'
                    },
                    body:{
                        "operationName": "customers",
                        "variables": {},
                        "query": "query customers($where: CustomerWhereInput, $orderBy: CustomerOrderByInput, $skip: Float, $take: Float) {\n  items: customers(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    createdAt\n    email\n    firstName\n    id\n    lastName\n    phone\n    updatedAt\n    orders {\n      id\n      __typename\n    }\n    address {\n      id\n      __typename\n    }\n    __typename\n  }\n  total: _customersMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n"
                    }
                },
                willRespondWith:{
                    status: 200,
                    headers: {
                        "Content-Type": 'application/json; charset=utf-8'
                    },
                    body: {
                        "data":
                        {"items":eachLike(
                            {"createdAt": somethingLike("2022-04-15T13:39:48.464Z"),
                            "email":somethingLike("jose.silva@mailinator.com"),
                            "firstName":somethingLike("José"),                            
                            "id":somethingLike("cl20h93e70361s8v9e3mbgkhv"),
                            "lastName":somethingLike("Silva"),
                            "phone":somethingLike("31998877665"),
                            "updatedAt":somethingLike("2022-04-15T13:39:48.464Z"),
                            "orders":[{"id":"cl20hlgt11151s8v9csuxbky5","__typename":"Order"}]
                        }, { min : 2}),                        
                            "total":{
                                "count":"2",
                                "__typename":"MetaQueryPayload"
                            }
                        }
                    }
                    }
                }
            )
        })
    })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())

    it('should return user list', () => {
        customerList().then(response=>{
            const { firstName, lastName } = response.data.data.items[0]

            expect(response.status).toEqual(200)
            expect(firstName).toBe('José')
            expect(lastName).toBe('Silva')
        })
    });
});