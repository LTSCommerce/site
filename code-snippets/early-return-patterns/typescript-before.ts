// BEFORE: Nested conditions obscure the main logic

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

class UserService {
  async updateUserProfile(
    userId: string, 
    profileData: Partial<UserProfile>
  ): Promise<{ success: boolean; message: string; user?: User }> {
    
    if (userId) {
      const user = await this.userRepository.findById(userId);
      
      if (user) {
        if (user.isActive) {
          if (user.permissions.includes('profile:update')) {
            if (profileData && Object.keys(profileData).length > 0) {
              if (this.validateProfileData(profileData)) {
                if (user.profile) {
                  // Main business logic buried in nested conditions
                  const updatedProfile = { ...user.profile, ...profileData };
                  user.profile = updatedProfile;
                  
                  await this.userRepository.save(user);
                  await this.auditService.logProfileUpdate(userId, profileData);
                  
                  return {
                    success: true,
                    message: 'Profile updated successfully',
                    user
                  };
                } else {
                  return {
                    success: false,
                    message: 'User profile does not exist'
                  };
                }
              } else {
                return {
                  success: false,
                  message: 'Invalid profile data provided'
                };
              }
            } else {
              return {
                success: false,
                message: 'Profile data is required'
              };
            }
          } else {
            return {
              success: false,
              message: 'Insufficient permissions to update profile'
            };
          }
        } else {
          return {
            success: false,
            message: 'User account is inactive'
          };
        }
      } else {
        return {
          success: false,
          message: 'User not found'
        };
      }
    } else {
      return {
        success: false,
        message: 'User ID is required'
      };
    }
  }

  private validateProfileData(data: Partial<UserProfile>): boolean {
    // Validation logic here
    return true;
  }
}