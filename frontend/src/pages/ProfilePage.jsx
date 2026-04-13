import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Settings,
  Key,
  Camera,
  ExternalLink,
  BadgeCheck,
  Loader2,
  Phone,
  MapPin,
  Save,
  X,
  CloudLightning,
} from 'lucide-react';

import {
  clearCredentials,
  selectCurrentUser,
  setCredentials,
} from '../store/authSlice';
import { useLogoutMutation } from '../services/authApi'; // Ensure you add updateProfile to authApi
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfileMutation } from '../services/userApi';

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: { city: '', state: '', pincode: '' },
  });

  // Sync local state when user data loads or edit mode opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        },
      });
    }
  }, [user, isEditing]);

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isGoogleUser = !!user.googleId;

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const user = await updateProfile(formData).unwrap();

      dispatch(
        setCredentials({
          user: user,
          token: localStorage.getItem('token'),
        }),
      );
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-end">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-3xl text-primary-foreground font-display">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-9 w-9 rounded-full border shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <h1 className="text-3xl font-bold tracking-tight font-display">
              {user.name}
            </h1>
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
            {isGoogleUser && (
              <Badge className="gap-1 bg-sky-100 text-sky-700 hover:bg-sky-100 border-none">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-sans">{user.email}</p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar: Account Details */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 font-sans">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span>{isGoogleUser ? 'Google Auth' : 'Password Auth'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="h-8 text-xs"
                    placeholder="Phone number"
                  />
                ) : (
                  <span>{user.phone || 'Add phone number'}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role Status */}
          <Card className="bg-secondary/20 border-none">
            <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Current Role
              </p>
              <p className="text-sm font-medium capitalize">
                {user.role} Member
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Permissions managed by system administrator.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Edit Form / Security */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Location & Profile</CardTitle>
              <CardDescription className="font-sans">
                Update your service location and display details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.address.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          pincode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold font-display">Security</h3>
                {isGoogleUser ? (
                  <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 flex items-start gap-3">
                    <ExternalLink className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold font-display">
                        Managed by Google
                      </p>
                      <p className="text-xs text-muted-foreground font-sans">
                        Security settings are handled via your Google Account.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between font-sans">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-secondary p-2">
                        <Key className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">
                          Change your account password
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
