import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// we are not "forced" to use the containers helpers to run specific queries like `getCurrentUser` which doesn't take any argument
const withCurrentUser = options => {

  const preloadedFields = _.compact(_.map(Users.simpleSchema()._schema, (field, fieldName) => {
    return field.preload ? fieldName : undefined;
  }));

  return graphql(
    gql`query getCurrentUser {
      currentUser {
        _id
        username
        createdAt
        ${preloadedFields.join('\n')}
      }
    }
    `, {
      props(props) {
        const {data: {loading, currentUser}} = props;
        return {
          loading,
          currentUser,
        };
      },
    }
  )
};

// Telescope.replaceComponent('App', Telescope.components.App, withCurrentUser);

export default withCurrentUser;