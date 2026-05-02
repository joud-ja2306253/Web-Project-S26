import { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="loading">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}