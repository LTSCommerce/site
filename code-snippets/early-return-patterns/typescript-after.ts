// AFTER: Guard clauses with modern TypeScript patterns (2025)

interface User {
  id: string;
  email: string;
  isActive: boolean;
  permissions: string[];
  profile?: UserProfile;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  department: string;
}

type UpdateResult = {
  success: boolean;
  message: string;
  user?: User;
};

class UserService {
  async updateUserProfile(
    userId: string, 
    profileData: Partial<UserProfile>
  ): Promise<UpdateResult> {
    
    // Guard clauses with modern syntax - handle edge cases first
    if (!userId?.trim()) {
      return {
        success: false,
        message: 'User ID is required'
      };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'User account is inactive'
      };
    }

    if (!user.permissions.includes('profile:update')) {
      return {
        success: false,
        message: 'Insufficient permissions to update profile'
      };
    }

    // Using nullish coalescing and optional chaining (ES2025 patterns)
    const hasValidData = profileData && Object.keys(profileData).length > 0;
    if (!hasValidData) {
      return {
        success: false,
        message: 'Profile data is required'
      };
    }

    if (!this.validateProfileData(profileData)) {
      return {
        success: false,
        message: 'Invalid profile data provided'
      };
    }

    if (!user.profile) {
      return {
        success: false,
        message: 'User profile does not exist'
      };
    }

    // Main business logic flows cleanly at the bottom
    const updatedProfile = { ...user.profile, ...profileData };
    user.profile = updatedProfile;

    await this.userRepository.save(user);
    await this.auditService.logProfileUpdate(userId, profileData);

    return {
      success: true,
      message: 'Profile updated successfully',
      user
    };
  }

  private validateProfileData(data: Partial<UserProfile>): boolean {
    // Modern validation with pattern matching
    return Object.entries(data).every(([key, value]) => {
      return value != null && typeof value === 'string' && value.trim().length > 0;
    });
  }
}