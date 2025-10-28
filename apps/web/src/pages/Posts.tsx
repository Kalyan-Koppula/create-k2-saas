import React from 'react';
import { useForm } from 'react-hook-form';
import { Post, CreatePostPayload } from '@k2-saas/shared-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePostsStore } from '../store/posts';

export function PostsPage() {
  const { posts, isLoading, error, fetchPosts, createPost, deletePost } = usePostsStore();
  const form = useForm<CreatePostPayload>();
  const [selectedUser, setSelectedUser] = React.useState<number>(1); // Demo: Fixed user ID

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onSubmit = async (data: CreatePostPayload) => {
    try {
      // Attach the demo user ID
      await createPost({ ...data, author_id: selectedUser });
      form.reset();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Post Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Share your thoughts with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input {...form.register('title', { required: true })} />
                </FormItem>

                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <textarea
                    {...form.register('content', { required: true })}
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormItem>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={isLoading}>
                  Create Post
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Browse and manage posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post: Post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {post.author?.name || 'Unknown'} • 
                          {new Date(post.created_at * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm">{post.content}</p>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No posts yet. Be the first to create one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}