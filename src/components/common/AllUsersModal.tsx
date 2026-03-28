import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";
import type { User } from "@/api/auth";
import { fetchAllUsers, updateUser, deleteUser } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

interface AllUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllUsersModal({ open, onOpenChange }: AllUsersModalProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditData({ ...user });
  };

  const handleSave = async (userId: number) => {
    try {
      setIsSaving(true);
      const updated = await updateUser(userId, editData);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
      setEditingId(null);
      setEditData({});
      toast.success(`User updated successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setIsDeleting(userId);
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success(`User deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full md:w-2xl h-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>All Users</SheetTitle>
        </SheetHeader>

        <div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 m-4">
                  {editingId === user.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Name
                        </label>
                        <Input
                          value={editData.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Email
                        </label>
                        <Input
                          value={editData.email || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              email: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Role
                        </label>
                        <select
                          value={editData.role || "PURCHASER"}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              role: e.target.value as User["role"],
                            })
                          }
                          className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        >
                          <option value="PURCHASER">Purchaser</option>
                          <option value="SUPERVISOR">Supervisor</option>
                          <option value="FINANCER">Financer</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(user.id)}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          <Check size={14} />
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          <X size={14} />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        {currentUser?.id !== user.id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeleting === user.id}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
