import { gql } from '@apollo/client';

export const GET_ME = gql `
    {
        me {
            _id
            username
            email
            bookInput
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;