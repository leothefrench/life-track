'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function SettingsProfileCard({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {

  return (
    <Card className="bg-white/5 border-white/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-white">Profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">Nom</label>
          <Input
            disabled
            defaultValue={name || ''}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">
            Email
          </label>
          <Input
            disabled
            defaultValue={email || ''}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
