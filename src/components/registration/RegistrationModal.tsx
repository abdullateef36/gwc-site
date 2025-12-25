import { useState } from "react";
import { X, Plus, Trash2, Users } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament } from "@/lib/tournaments";
import { TeamMember } from "@/lib/registration";

interface Props {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ tournament, isOpen, onClose }: Props) {
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", gameTag: "" }
  ]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "", gameTag: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async () => {
  setError("");

  // Validation - additionalNotes is optional, so don't check it
  if (!teamName.trim() ||!captainName.trim() ||!captainEmail.trim() ||!captainPhone.trim()) { setError("Please fill in all required fields");
  return;
}

  const hasEmptyMembers = teamMembers.some(
    member => !member.name || !member.email || !member.gameTag
  );

  if (hasEmptyMembers) {
    setError("Please complete all team member information");
    return;
  }

  setIsSubmitting(true);

  try {
    // Save to Firestore
    const registrationData = {
      tournamentId: tournament.id,
      tournamentTitle: tournament.title,
      teamName,
      captainName,
      captainEmail,
      captainPhone,
      teamMembers,
      additionalNotes, // This can be empty string, that's fine
      status: "pending" as const,
    };

    await addDoc(collection(db, "registrations"), {
        ...registrationData,
        registeredAt: serverTimestamp(),
    });
    // Send email notification
    await fetch("/api/send-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...registrationData,
        tournamentDate: tournament.date,
        tournamentPrize: tournament.prize,
      }),
    });

    // Reset form and close
    setTeamName("");
    setCaptainName("");
    setCaptainEmail("");
    setCaptainPhone("");
    setTeamMembers([{ name: "", email: "", gameTag: "" }]);
    setAdditionalNotes("");
    alert("Registration submitted successfully! You will receive a confirmation email shortly.");
    onClose();
  } catch (err) {
    console.error("Registration error:", err);
    setError("Failed to submit registration. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-gwc-gray max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gwc-light-gray p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gwc-light-gray rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-gwc-red" size={28} />
            <h2 className="text-2xl font-bold text-white">Tournament Registration</h2>
          </div>
          <p className="text-gray-400">{tournament.title}</p>
        </div>

        <div className="space-y-6">
          {/* Team Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Team Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Team Name *"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Captain Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Captain Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Captain Name *"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="Captain Email *"
                value={captainEmail}
                onChange={(e) => setCaptainEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
              />
              <input
                type="tel"
                placeholder="Captain Phone *"
                value={captainPhone}
                onChange={(e) => setCaptainPhone(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <button
                type="button"
                onClick={addTeamMember}
                className="flex items-center gap-2 px-4 py-2 bg-gwc-red/10 border border-gwc-red/30 text-gwc-red rounded-lg hover:bg-gwc-red/20 hover:border-gwc-red transition-all"
              >
                <Plus size={18} />
                Add Member
              </button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 bg-[#0d0d0d] rounded-lg border border-gwc-light-gray space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-400">Member {index + 1}</span>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="p-1 text-gwc-red hover:bg-gwc-red/10 rounded transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Player Name *"
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                    className="w-full p-3 rounded-lg bg-gwc-gray border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
                  />
                  <input
                    type="email"
                    placeholder="Player Email *"
                    value={member.email}
                    onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                    className="w-full p-3 rounded-lg bg-gwc-gray border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="In-Game Tag/Username *"
                    value={member.gameTag}
                    onChange={(e) => updateTeamMember(index, "gameTag", e.target.value)}
                    className="w-full p-3 rounded-lg bg-gwc-gray border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Notes (Optional)</h3>
            <textarea
              placeholder="Any additional information or special requests..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-[#0d0d0d] border border-gwc-light-gray focus:border-gwc-red focus:outline-none focus:ring-2 focus:ring-gwc-red/50 transition-all text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gwc-red hover:bg-[#c10500] px-6 py-4 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}
