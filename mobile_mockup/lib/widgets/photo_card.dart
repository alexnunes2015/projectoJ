import 'package:flutter/material.dart';

import '../app/app_strings.dart';

class PhotoCard extends StatelessWidget {
  const PhotoCard({
    super.key,
    required this.hasPhoto,
    required this.onTap,
  });

  final bool hasPhoto;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final subtitle =
        hasPhoto ? AppStrings.photoDoneSubtitle : AppStrings.photoEmptySubtitle;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: hasPhoto ? theme.colorScheme.primary : const Color(0xFFD9E1DD),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          Icon(
            hasPhoto ? Icons.check_circle : Icons.photo_camera_outlined,
            size: 44,
            color: hasPhoto ? theme.colorScheme.primary : Colors.black45,
          ),
          const SizedBox(height: 12),
          Text(
            hasPhoto ? AppStrings.photoDoneTitle : AppStrings.photoEmptyTitle,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
          if (subtitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              subtitle,
              style: theme.textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: onTap,
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text(AppStrings.photoButton),
            ),
          ),
        ],
      ),
    );
  }
}
