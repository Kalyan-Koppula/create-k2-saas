import React from 'react';
import type { PostPayload, PostResponse } from '@k2-saas/shared-types';
import { apiClient } from './utils/api';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function App() {
  const { register, handleSubmit } = useForm<PostPayload>();
  const [result, setResult] = React.useState<PostResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: PostPayload) => {
    setError(null);
    setResult(null);

    try {
      const result = await apiClient<PostResponse>('post', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setResult(result);
    } catch (err: any) {
      setError(err?.message ?? 'Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Send a Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...register('name', { required: true })} />
            </FormItem>
            <FormItem>
              <FormLabel>Message</FormLabel>
              <textarea
                {...register('message')}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FormItem>
            <Button type="submit">Send</Button>
          </form>

          {error && (
            <div className="mt-4 text-sm font-medium text-destructive">
              Error: {error}
            </div>
          )}

          {result && (
            <div className="mt-4 p-3 border rounded bg-muted">
              <div className="text-sm text-muted-foreground">Response:</div>
              <pre className="text-sm mt-2 p-2 bg-background rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
