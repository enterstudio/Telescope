import Telescope from 'meteor/nova:lib';
import Posts from '../collection.js'
import Users from 'meteor/nova:users';
import { addCallback } from 'meteor/nova:core';

// // ------------------------------------- posts.remove.validate -------------------------------- //

// function PostsRemoveValidation (post, currentUser) {
//   if (!currentUser || !Users.canEdit(currentUser, post)){
//     throw new Meteor.Error(606, 'You need permission to edit or delete a post');
//   }
//   return post;
// }
// addCallback("posts.remove.validate", PostsRemoveValidation);

// ------------------------------------- posts.remove.sync -------------------------------- //

function PostsRemoveOperations (post) {
  Users.update({_id: post.userId}, {$inc: {"postCount": -1}});
}
addCallback("posts.remove.sync", PostsRemoveOperations);

// ------------------------------------- posts.approve.async -------------------------------- //

/**
 * @summary set postedAt when a post is approved
 */
function PostsSetPostedAt (modifier, post) {
  modifier.$set.postedAt = new Date();
  return modifier;
}
addCallback("posts.approve.sync", PostsSetPostedAt);

/**
 * @summary Add notification callback when a post is approved
 */
function PostsApprovedNotification (post) {
  if (typeof Telescope.notifications !== "undefined") {
    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    Telescope.notifications.create(post.userId, 'postApproved', notificationData);
  }
}
addCallback("posts.approve.async", PostsApprovedNotification);

// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeletePosts (user, options) {
  if (options.deletePosts) {
    var deletedPosts = Posts.remove({userId: userId});
  } else {
    // not sure if anything should be done in that scenario yet
    // Posts.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
addCallback("users.remove.async", UsersRemoveDeletePosts);