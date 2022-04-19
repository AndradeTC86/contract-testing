import 'dotenv/config'

import { Pact } from '@pact-foundation/pact'
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { addressList } from '../request/address.request';

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Address Test', () => {
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
                        "operationName": "addresses",
                        "variables": {},
                        "query": "query addresses($where: AddressWhereInput, $orderBy: AddressOrderByInput, $skip: Float, $take: Float) {\n  items: addresses(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    address_1\n    address_2\n    city\n    createdAt\n    id\n    state\n    updatedAt\n    zip\n    customers {\n      id\n      __typename\n    }\n    __typename\n  }\n  total: _addressesMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n"
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
                            {"address_1": somethingLike("Avenida João Cesar de Oliveira"),
                            "address_2":somethingLike("Eldorado"),
                            "city":somethingLike("Contagem"),
                            "createdAt":somethingLike("2022-04-15T13:35:28.540Z"),
                            "id":somethingLike("cl20h3iu40062s8v91x6t0606"),
                            "state":somethingLike("Minas Gerais"),
                            "updatedAt":somethingLike("admin"),
                            "zip":somethingLike("20000000"),
                            "customers":[{"id":"cl20haxeg0500s8v9oi8zaj3c","__typename":"Customer"}]
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
        addressList().then(response=>{
            const { city, state } = response.data.data.items[0]

            expect(response.status).toEqual(200)
            expect(city).toBe('Contagem')
            expect(state).toBe('Minas Gerais')
        })
    });
});