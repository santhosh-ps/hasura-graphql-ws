import { gql, useSubscription } from '@apollo/client';

const USER = gql`
subscription  MyQuery {
  users {
    id
    name
  }
}
`;

export function UserList() {

const { loading, error, data } = useSubscription(USER);
if(loading){
  return 'loading...';
}
if(error) {
    console.log(error);
    return 'error'+JSON.stringify(error)
}
    return ( 
    <>
    <div>Users: </div>
    <div>
        <ul>
            {data.users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    </div>

    </>
 )
}