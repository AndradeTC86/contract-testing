import 'dotenv/config'

import { Pact } from '@pact-foundation/pact'
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { userList } from '../request/user.request';

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Consumer Test', () => {

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
                        "operationName": "users",
                        "variables": {},
                        "query": "query users($where: UserWhereInput, $orderBy: UserOrderByInput, $skip: Float, $take: Float) {\n  items: users(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    createdAt\n    firstName\n    id\n    lastName\n    roles\n    updatedAt\n    username\n    __typename\n  }\n  total: _usersMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n"
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
                            {"createdAt": somethingLike("2022-03-29T21:47:13.536Z"),
                            "firstName":somethingLike("Thiago"),
                            "id":somethingLike("cl1co6fpb00004kv9wsfk1m0j"),
                            "lastName":somethingLike("Andrade"),
                            "roles":["user"],
                            "updatedAt":somethingLike("2022-03-31T10:45:41.625Z"),
                            "username":somethingLike("admin"),
                            "__typename":somethingLike("User")
                        }, { min : 1}),                        
                            "total":{
                                "count":"1",
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
        userList().then(response=>{
            const { firstName, lastName } = response.data.data.items[0]

            expect(response.status).toEqual(200)
            expect(firstName).toBe('Thiago')
            expect(lastName).toBe('Andrade')
        })
    });
    
});