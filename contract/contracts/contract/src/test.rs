#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_create_post_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    let post_id_1 = client.create_post(&user1, &String::from_str(&env, "Hello Soroban!"));
    assert_eq!(post_id_1, 1);

    let post_id_2 = client.create_post(&user2, &String::from_str(&env, "Permissionless posts!"));
    assert_eq!(post_id_2, 2);

    assert_eq!(client.get_post_count(), 2);

    let post = client.get_post(&1);
    assert_eq!(post.author, user1);
    assert_eq!(post.content, String::from_str(&env, "Hello Soroban!"));
    assert_eq!(post.like_count, 0);
    assert_eq!(post.comment_count, 0);

    let post2 = client.get_post(&2);
    assert_eq!(post2.author, user2);
    assert_eq!(
        post2.content,
        String::from_str(&env, "Permissionless posts!")
    );
}

#[test]
fn test_posts_pagination_newest_first() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);

    client.create_post(&user, &String::from_str(&env, "Post one"));
    client.create_post(&user, &String::from_str(&env, "Post two"));
    client.create_post(&user, &String::from_str(&env, "Post three"));
    client.create_post(&user, &String::from_str(&env, "Post four"));
    client.create_post(&user, &String::from_str(&env, "Post five"));

    assert_eq!(client.get_post_count(), 5);

    let page0 = client.get_recent_posts(&0, &3);
    assert_eq!(page0.len(), 3);
    assert_eq!(page0.get(0).unwrap().id, 5);
    assert_eq!(page0.get(1).unwrap().id, 4);
    assert_eq!(page0.get(2).unwrap().id, 3);

    let page1 = client.get_recent_posts(&3, &3);
    assert_eq!(page1.len(), 2);
    assert_eq!(page1.get(0).unwrap().id, 2);
    assert_eq!(page1.get(1).unwrap().id, 1);
}

#[test]
fn test_comment_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let commenter1 = Address::generate(&env);
    let commenter2 = Address::generate(&env);

    let post_id = client.create_post(&author, &String::from_str(&env, "My first post"));

    client.add_comment(
        &post_id,
        &commenter1,
        &String::from_str(&env, "Great post!"),
    );
    client.add_comment(&post_id, &commenter2, &String::from_str(&env, "Love it!"));

    let comments = client.get_comments(&post_id, &0, &10);
    assert_eq!(comments.len(), 2);
    assert_eq!(comments.get(0).unwrap().author, commenter1);
    assert_eq!(
        comments.get(0).unwrap().content,
        String::from_str(&env, "Great post!")
    );
    assert_eq!(comments.get(1).unwrap().author, commenter2);
    assert_eq!(
        comments.get(1).unwrap().content,
        String::from_str(&env, "Love it!")
    );

    let post = client.get_post(&post_id);
    assert_eq!(post.comment_count, 2);
}

#[test]
fn test_comment_pagination() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let commenter = Address::generate(&env);
    let post_id = client.create_post(&author, &String::from_str(&env, "Test"));

    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Comment A"));
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Comment B"));
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Comment C"));
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Comment D"));
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Comment E"));

    let first3 = client.get_comments(&post_id, &0, &3);
    assert_eq!(first3.len(), 3);

    let next3 = client.get_comments(&post_id, &3, &3);
    assert_eq!(next3.len(), 2);
}

#[test]
fn test_like_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let liker1 = Address::generate(&env);
    let liker2 = Address::generate(&env);
    let liker3 = Address::generate(&env);

    let post_id = client.create_post(&author, &String::from_str(&env, "Like this!"));

    client.like_post(&post_id, &liker1);
    client.like_post(&post_id, &liker2);
    assert_eq!(client.get_like_count(&post_id), 2);
    assert!(client.has_liked(&post_id, &liker1));
    assert!(client.has_liked(&post_id, &liker2));
    assert!(!client.has_liked(&post_id, &liker3));

    let post = client.get_post(&post_id);
    assert_eq!(post.like_count, 2);
}

#[test]
#[should_panic(expected = "already liked this post")]
fn test_cannot_double_like() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let liker = Address::generate(&env);
    let post_id = client.create_post(&author, &String::from_str(&env, "Test"));

    client.like_post(&post_id, &liker);
    client.like_post(&post_id, &liker); // PANICS
}

#[test]
fn test_unlike_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let liker1 = Address::generate(&env);
    let liker2 = Address::generate(&env);

    let post_id = client.create_post(&author, &String::from_str(&env, "Unlike test"));

    client.like_post(&post_id, &liker1);
    client.like_post(&post_id, &liker2);
    assert_eq!(client.get_like_count(&post_id), 2);

    client.unlike_post(&post_id, &liker1);
    assert_eq!(client.get_like_count(&post_id), 1);
    assert!(!client.has_liked(&post_id, &liker1));
    assert!(client.has_liked(&post_id, &liker2));

    let post = client.get_post(&post_id);
    assert_eq!(post.like_count, 1);
}

#[test]
#[should_panic(expected = "has not liked this post")]
fn test_cannot_unlike_if_not_liked() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let liker = Address::generate(&env);
    let post_id = client.create_post(&author, &String::from_str(&env, "Test"));

    client.unlike_post(&post_id, &liker); // PANICS
}

#[test]
fn test_follow_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let carol = Address::generate(&env);

    client.follow(&alice, &bob);
    client.follow(&alice, &carol);

    assert_eq!(client.get_follower_count(&bob), 1);
    assert_eq!(client.get_follower_count(&carol), 1);
    assert_eq!(client.get_following_count(&alice), 2);
    assert!(client.is_following(&alice, &bob));
    assert!(client.is_following(&alice, &carol));
    assert!(!client.is_following(&bob, &alice));

    let following = client.get_following(&alice, &0, &10);
    assert_eq!(following.len(), 2);

    let followers = client.get_followers(&bob, &0, &10);
    assert_eq!(followers.len(), 1);
}

#[test]
#[should_panic(expected = "already following")]
fn test_cannot_follow_twice() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);

    client.follow(&alice, &bob);
    client.follow(&alice, &bob); // PANICS
}

#[test]
#[should_panic(expected = "cannot follow yourself")]
fn test_cannot_follow_self() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    client.follow(&alice, &alice); // PANICS
}

#[test]
fn test_unfollow_permissionless() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);

    client.follow(&alice, &bob);
    assert!(client.is_following(&alice, &bob));
    assert_eq!(client.get_follower_count(&bob), 1);
    assert_eq!(client.get_following_count(&alice), 1);

    client.unfollow(&alice, &bob);
    assert!(!client.is_following(&alice, &bob));
    assert_eq!(client.get_follower_count(&bob), 0);
    assert_eq!(client.get_following_count(&alice), 0);
}

#[test]
fn test_follow_pagination() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let carol = Address::generate(&env);
    let dave = Address::generate(&env);
    let eve = Address::generate(&env);
    let frank = Address::generate(&env);

    client.follow(&bob, &alice);
    client.follow(&carol, &alice);
    client.follow(&dave, &alice);
    client.follow(&eve, &alice);
    client.follow(&frank, &alice);

    let first3 = client.get_followers(&alice, &0, &3);
    assert_eq!(first3.len(), 3);
    let next3 = client.get_followers(&alice, &3, &3);
    assert_eq!(next3.len(), 2);
}

#[test]
fn test_feed_shows_followed_posts() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let carol = Address::generate(&env);

    client.create_post(&bob, &String::from_str(&env, "Bob post"));
    client.create_post(&carol, &String::from_str(&env, "Carol post"));
    client.create_post(&alice, &String::from_str(&env, "Alice post"));

    client.follow(&alice, &bob);
    client.follow(&alice, &carol);

    let feed = client.get_followed_feed(&alice, &0, &10);
    assert_eq!(feed.len(), 2);
    assert_eq!(feed.get(0).unwrap().author, carol);
    assert_eq!(feed.get(1).unwrap().author, bob);
}

#[test]
fn test_feed_excludes_non_followed() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);

    client.create_post(&bob, &String::from_str(&env, "Bob post"));
    client.create_post(&alice, &String::from_str(&env, "Alice post"));

    let feed = client.get_followed_feed(&alice, &0, &10);
    assert_eq!(feed.len(), 0);
}

#[test]
fn test_like_and_comment_counts_separate() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let liker = Address::generate(&env);
    let commenter = Address::generate(&env);

    let post_id = client.create_post(&author, &String::from_str(&env, "Mixed test"));

    client.like_post(&post_id, &liker);
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Nice!"));

    let post = client.get_post(&post_id);
    assert_eq!(post.like_count, 1);
    assert_eq!(post.comment_count, 1);

    client.unlike_post(&post_id, &liker);
    client.add_comment(&post_id, &commenter, &String::from_str(&env, "Still nice!"));

    let post2 = client.get_post(&post_id);
    assert_eq!(post2.like_count, 0);
    assert_eq!(post2.comment_count, 2);
}
