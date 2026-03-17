import 'package:flutter/material.dart';

import '../app/app_strings.dart';

class LocationCard extends StatelessWidget {
  const LocationCard({
    super.key,
    required this.locationSelected,
    required this.onTap,
  });

  final bool locationSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final subtitle = locationSelected
        ? AppStrings.locationSetSubtitle
        : AppStrings.locationUnsetSubtitle;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                locationSelected
                    ? Icons.location_on
                    : Icons.location_searching_outlined,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  locationSelected
                      ? AppStrings.locationSetTitle
                      : AppStrings.locationUnsetTitle,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          if (subtitle.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text(
              subtitle,
              style: theme.textTheme.bodyMedium,
            ),
          ],
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: onTap,
              icon: const Icon(Icons.my_location_outlined),
              label: const Text(AppStrings.locationButton),
            ),
          ),
        ],
      ),
    );
  }
}
