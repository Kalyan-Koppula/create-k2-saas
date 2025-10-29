import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { ApiResponse, Post, CreatePostPayload } from '@k2-saas/shared-types';
import { apiClient } from '../utils/api';

interface PostsStore {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<void>;
  updatePost: (
    id: number,
    payload: Partial<CreatePostPayload>
  ) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

type PostsStoreCreator = StateCreator<PostsStore>;

export const usePostsStore = create<PostsStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient<ApiResponse<Post[]>>('posts');
      if (!response.ok || !response.data) {
        throw new Error(response.error || 'Failed to fetch posts');
      }
      set({ posts: response.data });
    } catch (err: any) {
      set({ error: err?.message || 'Something went wrong' });
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (payload: CreatePostPayload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient<ApiResponse<Post>>('posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.data) {
        throw new Error(response.error || 'Failed to create post');
      }

      set((state: PostsStore) => ({
        posts: [...state.posts, response.data!],
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to create post' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePost: async (id: number, payload: Partial<CreatePostPayload>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient<ApiResponse<Post>>(`posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.data) {
        throw new Error(response.error || 'Failed to update post');
      }

      set((state: PostsStore) => ({
        posts: state.posts.map((post: Post) =>
          post.id === id ? response.data! : post
        ),
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update post' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deletePost: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient<ApiResponse>(`posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(response.error || 'Failed to delete post');
      }

      set((state: PostsStore) => ({
        posts: state.posts.filter((post: Post) => post.id !== id),
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to delete post' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
